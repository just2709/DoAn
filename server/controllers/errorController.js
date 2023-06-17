const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} = ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0].replace(/^"(.+(?="$))"$/, "$1");
  const message = `Duplicate field value: ${value}, please enter another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((error) => error.message);
  const message = `${errors.join(", ")}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () => new AppError("Invalid token, Please login first", 401);

const handleJWTExpiredError = () => new AppError("Your token is expired. Please login again", 401);

const sendErrorToDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errors: err,
    stacks: err.stack,
  });
};

const sendErrorToProduct = (err, res) => {
  // Operational, trusted error
  console.log(err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming
    res.status(500).json({
      status: "err",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  // console.log(err);
  // if (process.env.NODE_ENV === 'development') {
  sendErrorToDev(err, res);
  // } else if (process.env.NODE_ENV === 'production') {
  // let error = {};
  // if (err.name === "CastError") {
  //   error = handleCastErrorDB(err);
  // }
  // if (err.code === 11000) {
  //   error = handleDuplicateFieldsDB(err);
  // }
  // if (err.name === "ValidationError") {
  //   error = handleValidationErrorDB(err);
  // }
  // if (err.name === "JsonWebTokenError") {
  //   error = handleJsonWebTokenError(err);
  // }
  // if (err.name === "TokenExpiredError") {
  //   error = handleJWTExpiredError(err);
  // }

  // sendErrorToProduct(error, res);
  // }
};
