const { passwordHasher, passwordCompare } = require("../helper/authHelper");
const userModel = require("../models/userModel");
const colors = require("colors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//importing section end

// register controller start
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    //   destructuring validation
    if (!name) {
      return res
        .status(404)
        .send({ error: "name is required", success: false });
    }
    if (!email) {
      return res
        .status(404)
        .send({ error: "email is required", success: false });
    }
    if (!password) {
      return res
        .status(404)
        .send({ error: "password is required", success: false });
    }
    if (!phone) {
      return res
        .status(404)
        .send({ error: "phone is required", success: false });
    }
    if (!address) {
      return res
        .status(404)
        .send({ error: "address is required", success: false });
    }
    const emailCheck = await userModel.findOne({ email });
    if (emailCheck) {
      return res
        .status(500)
        .send({ error: "user already regitered please login", success: false });
    }
    //   checking existing user end
    const hashedpassword = await passwordHasher(password, 4);
    const user = await new userModel({
      name,
      email,
      password: hashedpassword,
      phone,
      address,
    }).save();
    //   saving user to database
    if (user) {
      const token = jwt.sign(
        { _id: user._id, name: user.name, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.LOGIN_EXP || "1y" }
      );
      if (!token) {
        return res.status(500).send({
          success: false,
          error: "error in login",
        });
      }
      console.log(
        `a new user registered as ${user.name} with email of ${user.email}`
          .bgYellow.blue
      );
      return res.status(201).send({
        message: "user registered successfully",
        success: true,
        user: { name: user.name, email: user.email, role: user.role },
        token,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
};
// register controller end

// login controller start
const logInController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ((!email, !password)) {
      return res.status(404).send({
        success: false,
        error: "invalid email or password",
      });
    }
    // user check
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, error: "email is not registered" });
    }
    // password check
    const matchPass = await passwordCompare(password, user.password);
    if (!matchPass) {
      return res
        .status(200)
        .send({ success: false, error: "invalid password" });
    }
    const token = jwt.sign(
      { _id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.LOGIN_EXP || "1y" }
    );
    if (!token) {
      return res.status(500).send({
        success: false,
        error: "error in login",
      });
    }
    console.log(
      `${user.name} loged in with email of ${user.email}`.bgYellow.blue
    );
    return res.status(200).send({
      message: "login successfully",
      success: true,
      user: { name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    return res.status(500).send({
      message: "error in login",
      success: false,
      error: error.message,
    });
  }
};
// login controller end

const userGetController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .send({ success: false, error: "an error occured" });
    }
    res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = { registerController, logInController, userGetController };
