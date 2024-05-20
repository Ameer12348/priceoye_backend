const orderModel = require("../models/orderModel");

// creating orders /
const createOrder = async (req, res) => {
  try {
    const products = req.body.products;
    const user = req.user;
    if (!products) {
      return res
        .status(404)
        .send({ success: false, error: "Products not found in your Cart" });
    }
    if (!user) {
      return res.status(404).send({ success: false, error: "User not found" });
    }
    const savedata = await orderModel.create({ products, buyer: user._id });
    if (!savedata) {
      return res
        .status(500)
        .send({ success: false, error: "an error occurred" });
    }
    res.status(201).send({ success: true, message: "ordered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// getting orders by user

const getuserOrder = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).send({ success: false, error: "User not found" });
    }
    const orders = await orderModel
      .find({ buyer: user._id })
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, orders });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

// getting all orders by Admin
const getAllOrdersByAdmin = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).send({ success: false, error: "User not found" });
    }
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.status(200).send({ success: true, orders });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

// cancel Order By User

const cancelOrder = async (req, res) => {
  try {
    const user = req.user;
    const action = req.body.action;
    const _id = req.params._id;
    if (!user) {
      return res.status(404).send({ success: false, error: "User not found" });
    }
    if (!action) {
      return res
        .status(404)
        .send({ success: false, error: "Action not found" });
    }
    const checkOrder = await orderModel.findById(_id);
    if (!checkOrder) {
      return res.status(404).send({ success: false, error: "order not found" });
    }

    const order = await orderModel.findByIdAndUpdate(
      _id,
      {
        status: action,
      },
      {
        new: true,
      }
    );
    if (!order) {
      return res
        .status(500)
        .send({ success: false, error: "an error occured" });
    }
    const orders = await orderModel
      .find({ buyer: user._id })
      .sort({ createdAt: -1 });
    if (!orders) {
      return res
        .status(500)
        .send({ success: false, error: "an error occured" });
    }
    res.status(200).send({ success: true, message: "Order Cancelled", orders });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
    console.log(error);
  }
};
// delete by by admin
const deleteOrder = async (req, res) => {
  try {
    const user = req.user;
    const action = req.body.action;
    const _id = req.params._id;
    if (!user) {
      return res.status(404).send({ success: false, error: "User not found" });
    }
    if (!action) {
      return res
        .status(404)
        .send({ success: false, error: "Action not found" });
    }
    if (action !== "delete") {
      return res.status(404).send({ success: false, error: "invalid Action" });
    }
    const checkOrder = await orderModel.findById(_id);
    if (!checkOrder) {
      return res.status(404).send({ success: false, error: "order not found" });
    }
    if (user.role !== "ADMIN") {
      return res.status(404).send({
        success: false,
        error: "only admin or buyer can delete this order",
      });
    }
    // if (
    //   checkOrder.status !== "Delivered" ||
    //   checkOrder.status !== "Cancelled"
    // ) {
    //   return res.status(500).send({
    //     success: true,
    //     error: "Order must be Delivered or Cancelled to delete",
    //   });
    // }

    const order = await orderModel.findByIdAndDelete(_id);
    if (!order) {
      return res
        .status(500)
        .send({ success: false, error: "an error occurred while deleting" });
    }
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    if (!orders) {
      return res
        .status(500)
        .send({ success: false, error: "an error occured" });
    }
    res
      .status(200)
      .send({ success: true, message: "Order deleted successfully", orders });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

// update by only admin
const updateOrder = async (req, res) => {
  try {
    const user = req.user;
    const _id = req.params._id;
    const action = req.body.action;
    if (!user) {
      return res.status(404).send({ success: false, error: "user not found" });
    }
    if (!action) {
      return res
        .status(404)
        .send({ success: false, error: "action not found" });
    }
    if (!_id) {
      return res
        .status(404)
        .send({ success: false, error: "order _id not found" });
    }

    const updateOrder = await orderModel.findByIdAndUpdate(
      _id,
      {
        status: action,
      },
      {
        new: true,
      }
    );
    if (!updateOrder) {
      return res
        .status(500)
        .send({ success: false, error: "an error occurred" });
    }
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    if (!orders) {
      return res
        .status(500)
        .send({ success: false, error: "an error occurred" });
    }
    res
      .status(200)
      .send({ success: true, message: "updated successfully", orders });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = {
  createOrder,
  getuserOrder,
  cancelOrder,
  deleteOrder,
  getAllOrdersByAdmin,
  updateOrder,
};
