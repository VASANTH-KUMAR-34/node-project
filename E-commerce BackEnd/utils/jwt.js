const jwt = require("jsonwebtoken");
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
  // * cookies

  res
    .cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })
    .json({
      user,
      token,
    });
};

module.exports = sendToken;
