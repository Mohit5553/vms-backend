const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  company: String,
  location: String,
  deviceId: String,
  title: String,
  videoUrl: String,
  status: { type: String, default: "STOPPED" },
});

module.exports = mongoose.model("Video", VideoSchema);
