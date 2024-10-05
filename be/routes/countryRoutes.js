const express = require('express');
const router = express.Router();
const CountryController = require('../controllers/countryController');

// Get all countries
router.get('/cms/countries', CountryController.getAllCountries);

// Get country by ID
router.get('/cms/countries/:id', CountryController.getCountryById);

// Create new country
router.post('/cms/countries', CountryController.createCountry);

// Update country
router.put('/cms/countries/:id', CountryController.updateCountry);

// Delete country
router.delete('/cms/countries/:id', CountryController.deleteCountry);

module.exports = router;
