const express = require("express");
const {
  registerController,
  logInController,
  userGetController,
  userGetByAdmin,
  getAllUsersData,
  updateUserRole,
  getUserDataByUser,
} = require("../controllers/userControllers");
const { getVerifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();
router.post("/v1/register", registerController);
router.post("/v1/login", logInController);
router.get("/v1/getuser", getVerifyToken, userGetController);
router.get("/v1/getadmin", getVerifyToken, isAdmin, userGetController);
router.get("/v1/getsingleuser/:_id", getVerifyToken, isAdmin, userGetByAdmin);
router.get("/v1/getallusers", getVerifyToken, isAdmin, getAllUsersData);
router.put("/v1/updateuserrole/:_id", getVerifyToken, isAdmin, updateUserRole);
router.get("/v1/getuserdata", getVerifyToken, getUserDataByUser);
module.exports = router;
