const express = require("express");
const productRouter = require("./router/productRouter");
const connectDb = require("./config/dataBaseConnection");
const errorHandler = require("./middleware/error");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userRouter = require("./router/userRouter");
const orderRouter = require("./router/orderRouter");
dotenv.config({ path: "./config/config.env" });
const port = 8000;
// * dataBase
connectDb();

//   * use of router
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);
app.use(errorHandler);

// * server
app.listen(port, console.log(`http://localhost/:${port}`));
