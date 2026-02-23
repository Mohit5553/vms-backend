const express = require("express");

const {
   createAdvertisement,
   viewAdvertisement,
   updateAdvertisement,
   deleteAdvertisement,
   listAdvertisements,
   playAdvertisements,
   stopAdvertisements,
   pauseAdvertisements,
} = require("../controllers/advertisement.controller");

const uploadVideo = require("../middleware/uploadVideo");

const router = express.Router();


/* =======================================================
   ✅ CREATE ADVERTISEMENT (VIDEO UPLOAD)
======================================================= */
router.post(
   "/create",
   uploadVideo.single("video"),
   createAdvertisement
);


/* =======================================================
   ✅ LIST ALL ADVERTISEMENTS
======================================================= */
router.get("/list", listAdvertisements);


/* =======================================================
   ✅ VIEW SINGLE ADVERTISEMENT
======================================================= */
router.get("/details/:id", viewAdvertisement);


/* =======================================================
   ✅ UPDATE ADVERTISEMENT
   (You can also add upload support here later)
======================================================= */
router.put(
   "/edit/:id",
   uploadVideo.single("video"), // 🔥 optional update video
   updateAdvertisement
);


/* =======================================================
   ✅ SOFT DELETE ADVERTISEMENT
======================================================= */
router.delete("/delete/:id", deleteAdvertisement);


/* =======================================================
   ✅ PLAY ADS ON DEVICE
======================================================= */
router.post("/play", playAdvertisements);


/* =======================================================
   ✅ STOP ADS
======================================================= */
router.post("/stop", stopAdvertisements);


/* =======================================================
   ✅ PAUSE ADS
======================================================= */
router.post("/pause", pauseAdvertisements);


/* =======================================================
   🚀 FUTURE FEATURES (Optional but recommended)
======================================================= */

/* 🔥 PLAY ADS FOR LOCATION */
router.post("/play-location", playAdvertisements);

/* 🔥 PLAY ADS FOR COMPANY */
router.post("/play-company", playAdvertisements);


module.exports = router;
