const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const user = require("../model/user");
const { json } = require("express");
const { use } = require("../router/router");
const userController = {
  // ! Register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // ! creating the user
    if (!username || !email || !password) {
      throw new Error("Please fill the required details");
    }
    const emailFound = await user.findOne({ email });
    if (emailFound) {
      throw new Error("User already found");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    // ! create the user
    const createUser = await user.create({
      username,
      email,
      password: hashPassword,
    });
    res.json({
      username: createUser.username,
      email: createUser.email,
      id: createUser.id,
    });
  }),

  //   ! login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // ! find the email in db
    const userFound = await user.findOne({ email });
    if (!userFound) {
      throw new Error("Invalid username and password");
    }
    const find = await bcrypt.compare(password, userFound.password);
    if (!find) {
      throw new Error("Invalid username and password");
    }
    const token = jwt.sign({ id: userFound._id }, "anyKey", {
      expiresIn: "2d",
    });
    res.json({
      message: "Login successful",
      token,
      id: userFound._id,
      email: userFound.email,
    });
  }),

  // !Profile
  profile: asyncHandler(async (req, res) => {
    // console.log(req.headers);
    const userFound = await user.findById(req.user).select("-password");
    res.json(userFound);
  }),
};

module.exports = userController;
