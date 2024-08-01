const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();
const { isAuthenticatedUser, isAdmin } = require("../middleware/authenticate");

// * user route
router.route("/register").post(userController.userRegister);
router.route("/login").post(userController.login);
router.route("/logout").get(userController.logout);
router.route("/profile").get(isAuthenticatedUser, userController.userProfile);
router
  .route("/password/change")
  .put(isAuthenticatedUser, userController.changePassword);
router
  .route("/updateProfile")
  .put(isAuthenticatedUser, userController.updateProfile);

// * Admin route
router
  .route("/admin/users")
  .get(isAuthenticatedUser, isAdmin("admin"), userController.allProfile);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, isAdmin("admin"), userController.singleProfile)
  .put(isAuthenticatedUser, isAdmin("admin"), userController.adminUpdate)
  .delete(isAuthenticatedUser, isAdmin("admin"), userController.deleteUser);
module.exports = router;
