const express = require("express");
const {
  createLocation,
  listLocationsByCompany,
  viewLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/location.controller");

const router = express.Router();

router.post("/create", createLocation);
router.get("/list/:companyId", listLocationsByCompany);
router.get("/details/:id", viewLocation);
router.put("/edit/:id", updateLocation);
router.delete("/delete/:id", deleteLocation);

module.exports = router;
