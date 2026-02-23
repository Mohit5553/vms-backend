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

    /* 🔥 Custom Device ID (NOT MAC) */
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

    /* 🔥 Order in playlist */
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