const express = require("express");
const mongoose = require("mongoose");
const router = require("./router/router");
const errorHandler = require("./middleware/error");
const app = express();
const port = 8000;
const url = "mongodb://localhost:27017/auth-api";
const cors = require("cors");

// ?Connect the mongodb
mongoose
  .connect(url)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());
app.use("/", router);
app.use(errorHandler);

// ? Start the server
app.listen(port, console.log(`http://localhost:${port}`));
