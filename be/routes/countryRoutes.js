// routes/countryRoutes.js
const express = require("express");
const router = express.Router();
const countryController = require("../controllers/CountryController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Routes for countries
router.get("/", countryController.getAllCountries);
router.post("/", countryController.createCountry);
router.get("/:id", countryController.getCountryById);
router.put("/:id", countryController.updateCountry);
router.delete("/:id", countryController.deleteCountry);

module.exports = router;
