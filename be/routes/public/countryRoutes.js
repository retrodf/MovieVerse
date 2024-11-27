const express = require("express");
const CountryControllerPublic = require("../../controllers/public/CountryController");

const router = express.Router();

router.get("/", CountryControllerPublic.getAll);
router.get("/:id", CountryControllerPublic.getById);
router.get("/filter", CountryControllerPublic.getAllForFilter); // New route for filter

module.exports = router;
