const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is a required field"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1208175274/vector/avatar-vector-icon-simple-element-illustrationavatar-vector-icon-material-concept-vector.jpg?s=612x612&w=0&k=20&c=t4aK_TKnYaGQcPAC5Zyh46qqAtuoPcb-mjtQax3_9Xc=",
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);
userSchema.methods.matchPassword = async function (givenPass) {
  return await bcrypt.compare(givenPass, this.password);
};
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified) {
    next();
  }
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  // expire after 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
