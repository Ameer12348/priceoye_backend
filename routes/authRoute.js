const express = require("express");
const {
  registerController,
  logInController,
  userGetController,
} = require("../controllers/userControllers");
const { getVerifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();
router.post("/v1/register", registerController);
router.post("/v1/login", logInController);
router.get("/v1/getuser", getVerifyToken, userGetController);
router.get("/v1/getadmin", getVerifyToken, isAdmin, userGetController);
module.exports = router;
