const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema(
  {
    company_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },
    ],

    location_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
      },
    ],

    // 🔥 MAC based device ID
    deviceId: [
      {
        type: String,
      },
    ],

    title: {
      type: String,
      trim: true,
    },

    description: String,

    startDate: Date,
    endDate: Date,

    playOrder: {
      type: Number,
      default: 1,
    },

    videoPath: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advertisement", advertisementSchema);
