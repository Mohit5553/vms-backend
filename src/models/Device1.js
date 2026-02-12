const DeviceSchema = new mongoose.Schema({
  deviceId: String,
  locationId: mongoose.Schema.Types.ObjectId,
  status: { type: String, default: "offline" },
});
module.exports = mongoose.model("Device", DeviceSchema);
