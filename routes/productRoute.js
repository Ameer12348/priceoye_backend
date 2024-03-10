const express = require("express");
const { getVerifyToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProduct,
  getProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  rateProduct,
  deleterate,
  getnotallowedreviews,
  updateallowedreview,
  getProductsByType,
} = require("../controllers/productControllers");
const { addImages } = require("../helper/productHelper");

const router = express.Router();

router.post(
  "/createproduct",
  getVerifyToken,
  isAdmin,
  addImages.single("thumbnail"),
  createProduct
);
router.get("/products", getProducts);
router.get("/products/:type", getProductsByType);
router.get("/getproduct/:slug", getSingleProduct);
router.delete("/deleteproduct/:_id", getVerifyToken, isAdmin, deleteProduct);
router.put(
  "/updateproduct/:_id",
  getVerifyToken,
  isAdmin,
  addImages.single("thumbnail"),
  updateProduct
);
router.post("/rateproduct/:_id", getVerifyToken, rateProduct);
router.delete("/deletereview/:_id/:rid", getVerifyToken, deleterate);
router.get(
  "/getnotallowedreviews",
  getVerifyToken,
  isAdmin,
  getnotallowedreviews
);
router.put(
  "/updatereview/:_id/:rid",
  getVerifyToken,
  isAdmin,
  updateallowedreview
);

module.exports = router;
