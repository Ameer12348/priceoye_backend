const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [{ type: Object }],
    paymentType: {
      type: String,
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "Buyer",
    },
    paymentType: {
      type: String,
      default: "COD",
    },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", orderSchema);
