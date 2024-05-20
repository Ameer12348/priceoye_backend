const express = require("express");
const { getVerifyToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  createOrder,
  getuserOrder,
  cancelOrder,
  deleteOrder,
  getAllOrdersByAdmin,
  updateOrder,
} = require("../controllers/orderController");

const router = express.Router();
router.post("/createorder", getVerifyToken, createOrder);
router.get("/userorders", getVerifyToken, getuserOrder);
router.get("/allorders", getVerifyToken, isAdmin, getAllOrdersByAdmin);
router.put("/cancelorder/:_id", getVerifyToken, cancelOrder);
router.put("/updateorder/:_id", getVerifyToken, isAdmin, updateOrder);
router.delete("/deleteorder/:_id", getVerifyToken, deleteOrder);
module.exports = router;
