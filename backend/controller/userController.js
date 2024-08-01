const asyncHandler = require("express-async-handler");
const user = require("../model/UserModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const bcrypt = require("bcrypt");
const userController = {
  // * user register
  userRegister: asyncHandler(async (req, res) => {
    const { userName, email, passWord, avatar } = req.body;
    const userData = await user.create({
      userName,
      email,
      passWord,
      avatar,
    });
    res.json({
      message: "user create successfully",
      userData,
    });
  }),

  // *login user
  login: asyncHandler(async (req, res, next) => {
    const { email, passWord } = req.body;
    if (!email || !passWord) {
      return next(new ErrorHandler("please enter the password and email", 400));
    }
    const data = await user.findOne({ email }).select("+passWord");
    // console.log(data.passWord);
    // console.log(passWord);
    if (!data) {
      return next(new ErrorHandler("Invalid password and email", 400));
    }
    const hashPassWord = await bcrypt.compare(passWord, data.passWord);
    // console.log(hashPassWord);
    if (!hashPassWord) {
      return next(new ErrorHandler("Invalid password and email", 400));
    }
    sendToken(data, 401, res);
  }),

  // * logout
  logout: asyncHandler((req, res) => {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        message: "Logout successful ",
      });
  }),

  // * user profile
  userProfile: asyncHandler(async (req, res) => {
    const data = await user.findById(req.user.id);
    res.json({
      data,
    });
  }),

  // * change the password
  changePassword: asyncHandler(async (req, res, next) => {
    const data = await user.findById(req.user.id).select("+passWord");
    // console.log(data);
    const hashPassWord = await bcrypt.compare(
      req.body.oldPassword,
      data.passWord
    );
    // console.log(hashPassWord);
    if (!hashPassWord) {
      return next(new ErrorHandler("Old password is incorrect", 401));
    }
    data.passWord = req.body.password;
    await data.save();
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        message: "password has been changed",
      });
  }),

  // * update profile
  updateProfile: asyncHandler(async (req, res, next) => {
    const data = {
      userName: req.body.username,
      email: req.body.email,
    };
    const value = await user.findByIdAndUpdate(req.user.id, data, {
      new: true,
      runValidators: true,
    });
    res.json({
      value,
    });
  }),

  // * admin route for seeing the all the user profile
  allProfile: asyncHandler(async (req, res, next) => {
    const data = await user.find();
    res.json({
      data,
    });
  }),

  // * seeing single profile
  singleProfile: asyncHandler(async (req, res, next) => {
    const data = await user.findById(req.params.id);
    if (!data) {
      return next(new ErrorHandler("User not found in this id", 404));
    }
    res.json({
      data,
    });
  }),

  // * Admin:userProfile update
  adminUpdate: asyncHandler(async (req, res, next) => {
    const data = {
      userName: req.body.username,
      email: req.body.email,
      role: req.body.role,
    };
    try {
      const value = await user.findByIdAndUpdate(req.params.id, data, {
        new: true,
        runValidators: true,
      });
      res.json({
        value,
      });
    } catch (error) {
      return res.json({
        message: "Enter the correct role",
      });
    }
  }),

  // * Admin:Delete user
  deleteUser: asyncHandler(async (req, res, next) => {
    const data = await user.findById(req.params.id);
    if (!data) {
      return next(new ErrorHandler("user not found in this id", 404));
    }
    await user.deleteOne({ _id: req.params.id });
    res.json({
      message: "successfully delete the user",
    });
  }),
};

module.exports = userController;
