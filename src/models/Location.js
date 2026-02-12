const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true, // 🔴 compulsory
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },

    contactPerson: {
      type: String,
    },

    phone: {
      type: String,
    },

    email: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Location", locationSchema);
