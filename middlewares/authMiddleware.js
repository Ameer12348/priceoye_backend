const JWT = require("jsonwebtoken");
const colors = require("colors");
const userModel = require("../models/userModel");
require("dotenv").config();

// jwt verify token
const getVerifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(404).send({ message: "token not found", success: false });
    }
    const dcode = JWT.verify(token, process.env.JWT_SECRET_KEY);
    if (!dcode) {
      return res
        .status(500)
        .send({ success: false, error: "an error occured" });
    }
    req.user = dcode;
    next();
  } catch (error) {
    res.status(500).send({ error: error.message, success: false });
    console.log(
      `middle ware got an error of ${error.message}`.bgMagenta.yellow
    );
  }
};

// admin check
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user._id) {
      return res
        .status(404)
        .send({ success: false, error: "an error occured" });
    }
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .send({ message: "user not found ", success: false });
    }
    if (user.role !== "ADMIN") {
      return res
        .status(401)
        .send({ error: "unauthorized access", success: false });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getVerifyToken, isAdmin };
