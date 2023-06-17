const asyncHandler = require("express-async-handler");
const generateToken = require("../token.js");
const User = require("../models/user");
const bcrypt = require("bcrypt");
// const sendEmail = require("../utils/mail.js");
const crypto = require("crypto");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendMail.js");

//Register new user

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    return next(new AppError("Vui lòng cung cấp những thông tin được yêu cầu", 400));
  }
  // Check if the email is already registered
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new AppError("Tài khoản đã tồn tại", 400));
    // res.status(400);
  }
  // create new user in the database
  const newUser = await User.create({
    name,
    email,
    password,
    image: pic,
  });
  // response
  if (newUser) {
    res.status(200).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
      },
      message: "Đăng ký tài khoản thành công",
      token: generateToken(newUser._id),
    });
  } else {
    return next(new AppError("Có gì đó không đúng, vui lòng thử lại", 500));
  }
});

//Login existing user
const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist && (await userExist.matchPassword(password))) {
      res.status(200).json({
        user: userExist,
        message: "user successfully logged in",
        token: generateToken(userExist._id),
      });
    } else {
      return next(new AppError("Tài khoản hoặc mật khẩu không chính xác", 400));
    }
  } catch (err) {
    return next(new AppError("Có gì đó không đúng vui lòng thử lại", 500));
  }
});

// @desc			Get a certain user
// @route			GET /api/users?search=
// @access		Private
const allUsers = asyncHandler(async (req, res, next) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [{ name: { $regex: req.query.search, $options: "i" } }, { email: { $regex: req.query.search, $options: "i" } }],
        }
      : {};
    const allUserData = await User.find(keyword).find({
      _id: { $ne: req.user._id },
    });
    if (allUserData.length === 0) {
      res.status(200).json({
        message: "Không có tài khoản nào",
      });
    }
    res.status(200).json({
      users: allUserData,
    });
  } catch (err) {
    throw new Error(err, 500);
  }
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1, Get user base on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("Không có tài khoản nào phù hợp với email bạn cung cấp, vui lòng kiểm tra lại", 404));
  }
  // 2, Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3, Send reset token to user's email
  const resetURL = `http://localhost:3000/resetPassword/${resetToken}`;
  const message = `<h1>Nhấn vào nút phía dưới để tiến hành thay đổi mật khẩu, mã xác nhận có hiệu lực trong 10 phút</h1> 
    <a href=${resetURL} style="background-color: blue; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
    Đổi mật khẩu
    </a>`;
  try {
    await sendEmail({
      email: req.body.email,
      subject: "ChatAPP: Đổi mật khẩu",
      message: message,
    });
    return next(new AppError("Mail xác nhận đã được gửi, vui lòng kiểm tra email của bạn 🤗🤗🤗", 200));
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
  } catch (error) {
    console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("Có gì đó không đúng vui lòng thử lại", 500));
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  // 1, Get user base on the token
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2, If token has not expired and there is user => set new password
  if (!user) {
    return next(new AppError("Token đã hết hạn. Vui lòng tiến hành gửi lại yêu cầu đổi mật khẩu", 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3, Update changedPasswordAt
  // 4, Login user, sent JWT
  const token = generateToken(user._id);
  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
    token,
  });
});

module.exports = { registerUser, loginUser, allUsers, forgotPassword, resetPassword };
