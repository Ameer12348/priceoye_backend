// import section start //
const express = require("express");
const database = require("./config/db");
const authRoute = require("./routes/authRoute");
const cors = require("cors");
const productRoute = require("./routes/productRoute");
require("dotenv").config();
const path = require("path");
const colors = require("colors");
const orderRoute = require("./routes/orderRoute");

// usin of app middlewares start //
const app = express();
app.use(express.static(path.join(__dirname, "/data")));
app.use(express.json());
app.use(cors());
app.use("/auth", authRoute);
app.use(productRoute);
app.use(orderRoute);
app.use("*", (req, res) => {
  res.status(404).send({ error: "route does not exist", success: false });
});
const PORT = process.env.PORT;

// database connection start
database(app, PORT);
