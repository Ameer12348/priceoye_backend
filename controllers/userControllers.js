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

// useget controller by admin
const userGetByAdmin = async (req, res) => {
  try {
    const _id = req.params._id;
    if (!_id) {
      return res
        .status(404)
        .send({ success: false, error: "user details not found in params" });
    }
    const gettingUser = await userModel.findOne({ _id });
    if (!gettingUser) {
      return res
        .status(404)
        .send({ success: false, error: "user not found in database" });
    }
    res.status(200).send({
      success: true,
      message: "use got successfully",
      user: {
        name: gettingUser.name,
        email: gettingUser.email,
        phone: gettingUser.phone,
        address: gettingUser.address,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, error: error.message });
  }
};

// getting all users by admin
const getAllUsersData = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).send({ success: false, error: "User not found" });
    }
    const allusersdata = await userModel.find({}).sort({ createdAt: -1 });
    const users = allusersdata.map((user1) => {
      return {
        _id: user1._id,
        name: user1.name,
        email: user1.email,
        phone: user1.phone,
        role: user1.role,
        createdAt: user1.createdAt,
        address: user1.address,
      };
    });
    res.send({
      success: true,
      message: "all users got",
      users,
    });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

// update user role by Admin

const updateUserRole = async (req, res) => {
  try {
    const _id = req.params._id;
    const action = req.body.action;
    const user = req.user;
    if (!_id) {
      return res
        .status(404)
        .send({ success: false, error: "user not found in params" });
    }
    if (!action) {
      return res
        .status(404)
        .send({ success: false, error: "action not found" });
    }
    const usercheck = await userModel.find({ _id });
    if (!usercheck) {
      return res
        .status(404)
        .send({ success: false, error: "user not found in database" });
    }

    const updateuser = await userModel.findByIdAndUpdate(
      _id,
      {
        role: action,
      },
      {
        new: true,
      }
    );
    if (!updateuser) {
      return res
        .status(500)
        .send({ success: false, error: "an error occurred" });
    }
    const allusersdata = await userModel.find({}).sort({ createdAt: -1 });
    const users = allusersdata.map((user1) => {
      return {
        _id: user1._id,
        name: user1.name,
        email: user1.email,
        phone: user1.phone,
        role: user1.role,
        createdAt: user1.createdAt,
        address: user1.address,
      };
    });

    res
      .status(200)
      .send({ success: true, message: "user updated successfull", users });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

// getting user data by its own

const getUserDataByUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).send({ success: false, error: "user not found" });
    }
    const checkuser = await userModel.findById(user._id);
    if (!checkuser) {
      return res
        .status(404)
        .send({ success: false, error: "user not found in database" });
    }
    res.status(200).send({
      success: true,
      message: "user got successfully",
      user: {
        _id: checkuser._id,
        name: checkuser.name,
        email: checkuser.email,
        phone: checkuser.phone,
        address: checkuser.address,
      },
    });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};
module.exports = {
  registerController,
  logInController,
  userGetController,
  userGetByAdmin,
  getAllUsersData,
  updateUserRole,
  getUserDataByUser,
};
