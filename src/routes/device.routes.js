const express = require("express");
const router = express.Router();

const {
   createDevice,
   getAllDevices,
   getDeviceById,
   updateDevice,
   deleteDevice,
   checkDevice,
   getDeviceByToken, // 🔥 NEW
   registerDevice, // 🔥 ADD THIS

} = require("../controllers/device.controller");


/* =======================================================
   ✅ CREATE DEVICE
======================================================= */
router.post("/create", createDevice);

router.post("/register", registerDevice);
/* =======================================================
   ✅ CHECK DEVICE BY DEVICE ID
======================================================= */
router.get("/check/:deviceId", checkDevice);


/* =======================================================
   ✅ GET DEVICE BY TOKEN (SHORT URL SUPPORT)
   Example: /devices/by-token/abc123
======================================================= */
router.get("/by-token/:token", getDeviceByToken);


/* =======================================================
   ✅ GET ALL DEVICES
======================================================= */
router.get("/list", getAllDevices);


/* =======================================================
   ✅ GET SINGLE DEVICE BY ID
======================================================= */
router.get("/listbyid/:id", getDeviceById);


/* =======================================================
   ✅ UPDATE DEVICE
======================================================= */
router.put("/update/:id", updateDevice);


/* =======================================================
   ✅ DELETE DEVICE
======================================================= */
router.delete("/delete/:id", deleteDevice);


module.exports = router;
