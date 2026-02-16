const mongoose = require("mongoose");

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === "production";

  let MONGO_URI;

  if (isProduction) {
    MONGO_URI = process.env.MONGO_URI_ATLAS;
    console.log("Using Atlas Database");
  } else {
    MONGO_URI = process.env.MONGO_URI_LOCAL;
    console.log("Using Local Database");
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
