const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userData = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please enter the name"],
  },
  email: {
    type: String,
    required: [true, "Please enter the email"],
    unique: true,
    validate: [validator.isEmail, "Please enter the email in correct form"],
  },
  passWord: {
    type: String,
    required: [true, "Please enter the password"],
    maxlength: [10, "password cannot exceed 10 letter"],
    select: false,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
    enum: {
      values: ["admin", "user"],
    },
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

// * bcrypt function
userData.pre("save", async function (next) {
  this.passWord = await bcrypt.hash(this.passWord, 10);
});

let user = mongoose.model("user", userData);
module.exports = user;
