// const mongoose = require("mongoose");

// const connectDB = async () => {
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log("MongoDB Connected");
// };

// module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === "production";

  const MONGO_URI = isProduction
    ? process.env.MONGO_URI_ATLAS
    : process.env.MONGO_URI_LOCAL;

  console.log("Connecting to:", MONGO_URI);

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      retryWrites: true,
      tls: isProduction, // TLS only for Atlas
    });

    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
