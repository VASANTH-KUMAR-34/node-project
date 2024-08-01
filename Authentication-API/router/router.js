const express = require("express");
const userController = require("../controller/userController");
const isAuthentication = require("../middleware/isAuth");

const router = express.Router();

router.post("/api/users/register", userController.register);
router.post("/api/users/login", userController.login);
router.get("/api/users/profile", isAuthentication, userController.profile);

module.exports = router;
