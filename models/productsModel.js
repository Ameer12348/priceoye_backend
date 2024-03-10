const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      default: "",
    },
    productDetails: {
      type: Object,
      required: true,
    },
    lastPrice: {
      type: Number,
      default: 0,
    },
    newPrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    reviews: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", productSchema);
