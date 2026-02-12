const express = require("express");
const {
  createAdvertisement,
  viewAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  listAdvertisements,
  playAdvertisements,
  stopAdvertisements,
} = require("../controllers/advertisement.controller");
const uploadVideo = require("../middleware/uploadVideo");

const router = express.Router();

router.post("/create", uploadVideo.single("video"), createAdvertisement);
router.get("/list", listAdvertisements);

router.get("/details/:id", viewAdvertisement);
router.put("/edit/:id", updateAdvertisement);
router.delete("/delete/:id", deleteAdvertisement);
router.post("/play", playAdvertisements);
router.post("/stop", stopAdvertisements);

module.exports = router;
