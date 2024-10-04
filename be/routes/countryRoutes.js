const express = require('express');
const router = express.Router();
const CountryController = require('../controllers/countryController');

// CMS routes
router.get('/cms/countries', CountryController.getAllCountries);  // Read all countries
router.post('/cms/countries', CountryController.createCountry);  // Create new country

module.exports = router;
