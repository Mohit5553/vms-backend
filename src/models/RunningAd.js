const RunningAdSchema = new mongoose.Schema({
  videoId: mongoose.Schema.Types.ObjectId,
  deviceId: String,
  startedAt: Date,
});
module.exports = mongoose.model("RunningAd", RunningAdSchema);
