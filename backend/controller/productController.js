const asyncHandler = require("express-async-handler");
const product = require("../model/ProductModel");
const ErrorHandler = require("../utils/errorHandler");
const APIFeatures = require("../utils/apiFeatures");

const productController = {
  getProduct: asyncHandler(async (req, res) => {
    const apiFeatures = new APIFeatures(product.find(), req.query)
      .search()
      .filter();
    const products = await apiFeatures.query;
    res.json({
      products,
    });
  }),
  //  * new product
  newProduct: asyncHandler(async (req, res) => {
    req.body.user = req.user.id;
    const products = await product.create(req.body);
    res.json({
      products,
    });
  }),

  // * find one product
  singleProduct: asyncHandler(async (req, res, next) => {
    const products = await product.findById(req.params.id);
    if (!products) {
      return next(new ErrorHandler("Product not found", 404));
    } else {
      res.status(201).json({
        products,
      });
    }
  }),

  // * update the product
  updateProduct: asyncHandler(async (req, res, next) => {
    let products = product.findById(req.params.id);
    if (!products) {
      return next(new ErrorHandler("Product not found", 404));
    }
    products = await product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({
      products,
    });
  }),

  // * Delete the product
  deleteProduct: asyncHandler(async (req, res, next) => {
    const products = await product.findById(req.params.id);
    if (!products) {
      return next(new ErrorHandler("Product not found", 404));
    }
    await product.findByIdAndDelete(req.params.id);
    res.json({
      message: "Delete successful",
    });
  }),

  // *adding the review
  createReview: asyncHandler(async (req, res, next) => {
    const { productId, rating, comment } = req.body;
    const data = await product.findById(productId);
    const review = {
      user: req.user.id,
      rating,
      comment,
    };
    const isRated = data.reviews.find((ele) => {
      return ele.user.toString() === req.user.id;
    });
    if (isRated) {
      data.reviews.forEach((ele) => {
        if (ele.user.toString() == req.user.id.toString()) {
          ele.comment = comment;
          ele.rating = rating;
        }
      });
    } else {
      data.reviews.push(review);
      data.numOfReviews = data.reviews.length;
    }
    data.rating =
      data.reviews.reduce((acc, review) => {
        return review.rating + acc;
      }, 0) / data.reviews.length;
    data.rating = isNaN(data.rating) ? 0 : data.rating;
    await data.save({ validateBeforeSave: false });
    res.json({
      message: "Successfully update",
    });
  }),

  // * getting all the reviews
  review: asyncHandler(async (req, res, next) => {
    const data = await product.findById(req.query.id);
    res.json({
      data,
    });
  }),

  // * Delete the review
  deleteReview: asyncHandler(async (req, res, next) => {
    const data = await product.findById(req.query.productId);

    //filtering the reviews which does match the deleting review id
    const reviews = data.reviews.filter((review) => {
      return review._id.toString() !== req.query.id.toString();
    });
    //number of reviews
    const numOfReviews = reviews.length;

    //finding the average with the filtered reviews
    let ratings =
      reviews.reduce((acc, review) => {
        return review.rating + acc;
      }, 0) / reviews.length;
    ratings = isNaN(ratings) ? 0 : ratings;

    //save the product document
    await Product.findByIdAndUpdate(req.query.productId, {
      reviews,
      numOfReviews,
      ratings,
    });
    res.status(200).json({
      success: true,
    });
  }),
};

module.exports = productController;
