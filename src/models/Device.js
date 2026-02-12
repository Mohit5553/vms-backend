const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema(
    {
        deviceId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        deviceName: {            // ✅ NEW FIELD
            type: String,
            required: true,
            trim: true,
        },

        company_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },

        // ✅ CHANGE HERE → ARRAY OF LOCATIONS
        location_id: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location",
                required: true,
            },
        ],

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Device", DeviceSchema);
