const express = require("express");
const router = express.Router();
const {
    createDevice,
    getAllDevices,
    getDeviceById,
    updateDevice,
    deleteDevice,
    checkDevice,
} = require("../controllers/device.controller");

// CREATE
router.post("/create", createDevice);

// CHECK BY DEVICE ID
router.get("/check/:deviceId", checkDevice);

// READ ALL
router.get("/list", getAllDevices);

// READ ONE
router.get("/listbyid/:id", getDeviceById);

// UPDATE
router.put("/update/:id", updateDevice);

// DELETE
router.delete("/delete/:id", deleteDevice);

module.exports = router;
