const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    deviceId: {
      type: [String],   // 👈 CHANGE HERE
      required: true,
    },


    title: {
      type: String,
      required: true,
    },

    description: String,

    videoPath: {
      type: String, // local file path
      required: true,
    },

    startDate: Date,
    endDate: Date,

    playOrder: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Advertisement", advertisementSchema);
