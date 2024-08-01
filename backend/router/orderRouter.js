const express = require("express");
const { isAdmin, isAuthenticatedUser } = require("../middleware/authenticate");
const orderController = require("../controller/orderController");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, orderController.newOrder);
router
  .route("/order/:id")
  .get(isAuthenticatedUser, orderController.singleOrder);
router.route("/myOrder").get(isAuthenticatedUser, orderController.allOrder);

// * Admin
router
  .route("/admin/order")
  .get(isAuthenticatedUser, isAdmin("admin"), orderController.orders);

router
  .route("/admin/update/:id")
  .put(isAuthenticatedUser, isAdmin("admin"), orderController.orderUpdate);
router
  .route("/admin/delete/:id")
  .delete(isAuthenticatedUser, isAdmin("admin"), orderController.adminDelete);
module.exports = router;
