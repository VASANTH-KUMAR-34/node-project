const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const user = require("../model/UserModel");

exports.isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login first to access the page", 401));
  }
  const decode = jwt.verify(token, process.env.JWT_KEY);
  req.user = await user.findById(decode.id);
  next();
});

exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Role ${req.user.role} is not allow`, 401));
    }
    next();
  };
};
