const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/e-cart";

const connectDb = () => {
  mongoose
    .connect(url)
    .then(() => console.log("connect"))
    .catch((err) => console.log(err));
};
module.exports = connectDb;
