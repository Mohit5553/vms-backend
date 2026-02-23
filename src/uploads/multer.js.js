// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: "uploads",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "_" + file.originalname);
//   },
// });

// module.exports = multer({ storage });
const multer = require("multer");
const path = require("path");

// 🔥 Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos"); // save in videos folder
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "_" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// 🔥 Video file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["video/mp4"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
});
