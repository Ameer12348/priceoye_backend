const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        file.originalname +
        new Date().getTime() +
        "." +
        file.mimetype.split("/")[1]
    );
  },
});

const addImages = multer({
  storage,
});

module.exports = { addImages };
