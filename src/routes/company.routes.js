const express = require("express");
const {
  createCompany,
  listCompanies,
  viewCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/company.controller");

const router = express.Router();

router.post("/create", createCompany);
router.get("/list", listCompanies);
router.get("/details/:id", viewCompany);
router.put("/edit/:id", updateCompany);
router.delete("/delete/:id", deleteCompany);

module.exports = router;
