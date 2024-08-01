const order = require("../model/OrderModel");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");
const product = require("../model/ProductModel");

const orderController = {
  // * new Order

  newOrder: asyncHandler(async (req, res, next) => {
    const {
      orderItems,
      shippingAddress,
      orderPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
    } = req.body;
    const data = await order.create({
      orderItems,
      shippingAddress,
      orderPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      paidAt: Date.now(),
      user: req.user.id,
    });
    res.json({
      data,
    });
  }),

  // * get single order
  singleOrder: asyncHandler(async (req, res, next) => {
    const data = await order
      .findById(req.params.id)
      .populate("user", "userName email ");
    if (!data) {
      return next(
        new ErrorHandler(`order found in this id ${req.params.id}`, 404)
      );
    }
    res.json({
      data,
    });
  }),

  // * get all the order for logged user
  allOrder: asyncHandler(async (req, res, next) => {
    const data = await order.find({ user: req.user.id });
    if (data.length === 0) {
      return next(
        ErrorHandler(`No order found in this user id ${req.user.id}`, 404)
      );
    }
    res.json({
      data,
    });
  }),

  // * Admin route
  // * Admin : get all order for the admin
  orders: asyncHandler(async (req, res, next) => {
    const data = await order.find();
    let totalPrices = 0;
    data.forEach((ele) => {
      totalPrices += ele.totalPrice;
    });
    res.json({
      data,
      totalPrices: totalPrices,
    });
  }),

  // * admin update  orderStatus
  orderUpdate: asyncHandler(async (req, res, next) => {
    const data = await order.findById(req.params.id);
    if (data.orderStatus == "Delivered") {
      return next(new ErrorHandler("Order has been already delivered", 404));
    }
    data.orderItems.forEach(async (orderItems) => {
      await updateStock(orderItems.product, orderItems.quantity);
    });
    data.orderStatus = req.body.orderStatus;
    data.deliveredAt = Date.now();
    await data.save();
    res.json({
      success: true,
      message: "Product update successfully",
    });
  }),

  // * Admin delete order
  adminDelete: asyncHandler(async (req, res, next) => {
    const data = await order.findById(req.params.id);
    if (!data) {
      return next(new ErrorHandler("Order id is not found", 404));
    }
    await order.findByIdAndDelete(req.params.id);
    res.json({
      message: "Order has been deleted",
    });
  }),
};

async function updateStock(productId, quantity) {
  const data = await product.findById(productId);
  data.stock -= quantity;
  await data.save({ validateBeforeSave: false });
}

module.exports = orderController;
