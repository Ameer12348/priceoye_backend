const mongoose = require("mongoose");

require("dotenv").config();
const database = async (app, PORT) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    await console.log(" database connection established ".bgGreen.white);
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`.bgWhite);
    });
  } catch (er) {
    console.log(
      `an error occured while connecting to database : ${er}`.bgRed.yellow
    );
  }
};

module.exports = database;
