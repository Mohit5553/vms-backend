const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema(
    {
        deviceId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        deviceName: {
            type: String,
            required: true,
            trim: true,
        },

        company_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },

        // ✅ MULTI LOCATION
        location_id: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location",
                required: true,
            },
        ],

        // 🔥 NEW → SHORT TOKEN FOR SCREEN URL
        screenToken: {
            type: String,
            unique: true,
            index: true,
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Device", DeviceSchema);
