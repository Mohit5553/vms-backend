const Device = require("../models/Device");

// ✅ CREATE DEVICE
exports.createDevice = async (req, res) => {
    try {
        let { deviceId, deviceName, company_id, location_id, status } = req.body;

        const exists = await Device.findOne({ deviceId });
        if (exists) {
            return res.status(400).json({ message: "Device already exists" });
        }

        // Ensure locations is always an array
        const locations = Array.isArray(location_id)
            ? location_id
            : location_id
                ? [location_id]
                : [];

        const device = await Device.create({
            deviceId,
            deviceName,      // ✅ included everywhere
            company_id,
            location_id: locations,
            status,
        });

        res.status(201).json({
            message: "Device created successfully",
            data: device,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ GET ALL DEVICES
exports.getAllDevices = async (req, res) => {
    try {
        const devices = await Device.find()
            .populate("company_id", "name")
            .populate("location_id", "name"); // works with array too

        res.json({ data: devices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ GET SINGLE DEVICE
exports.getDeviceById = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id)
            .populate("company_id", "name")
            .populate("location_id", "name");

        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }

        res.json({ data: device });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ UPDATE (EDIT) DEVICE  — FIXED FOR deviceName + multi-location
exports.updateDevice = async (req, res) => {
    try {
        const { deviceId, location_id } = req.body;

        // Check unique deviceId if changed
        if (deviceId) {
            const exists = await Device.findOne({
                deviceId,
                _id: { $ne: req.params.id },
            });

            if (exists) {
                return res.status(400).json({ message: "Device ID already in use" });
            }
        }

        // Normalize locations to array if sent
        if (location_id) {
            req.body.location_id = Array.isArray(location_id)
                ? location_id
                : [location_id];
        }

        const device = await Device.findByIdAndUpdate(
            req.params.id,
            req.body,   // includes deviceName if sent
            { new: true, runValidators: true }
        );

        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }

        res.json({
            message: "Device updated successfully",
            data: device,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ DELETE DEVICE (no change needed)
exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);

        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }

        res.json({ message: "Device deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ CHECK DEVICE BY deviceId
exports.checkDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;

        const device = await Device.findOne({ deviceId });

        res.json({
            found: !!device,
            device,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
