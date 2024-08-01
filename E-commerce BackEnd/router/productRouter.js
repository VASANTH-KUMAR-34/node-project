const express = require("express");
const productController = require("../controller/productController");
const { isAuthenticatedUser, isAdmin } = require("../middleware/authenticate");

const router = express.Router();

// * product router
router.get("/product", isAuthenticatedUser, productController.getProduct);
router.post(
  "/admin/product/new",
  isAuthenticatedUser,
  isAdmin("admin"),
  productController.newProduct
);
router
  .route("/product/:id")
  .get(isAuthenticatedUser, isAdmin("admin"), productController.singleProduct)
  .put(isAuthenticatedUser, isAdmin("admin"), productController.updateProduct)
  .delete(productController.deleteProduct);
router
  .route("/product/review")
  .put(isAuthenticatedUser, productController.createReview)
  .delete(isAuthenticatedUser, productController.deleteReview);
router.route("/reviews").get(productController.review);
module.exports = router;
