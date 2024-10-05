const Country = require('../models/countryModel');

const CountryController = {
  // Get all countries
  getAllCountries: async (req, res) => {
    try {
      const [countries] = await Country.getAllCountries();
      res.status(200).json(countries);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving countries' });
    }
  },

  // Get country by ID
  getCountryById: async (req, res) => {
    try {
      const { id } = req.params;
      const [country] = await Country.getCountryById(id);
      if (country.length === 0) {
        return res.status(404).json({ message: 'Country not found' });
      }
      res.status(200).json(country[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving country' });
    }
  },

  // Create a new country
  createCountry: async (req, res) => {
    try {
      const { name } = req.body;
      const [result] = await Country.createCountry(name);
      res.status(201).json({ message: 'Country created successfully', id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating country' });
    }
  },

  // Update country
  updateCountry: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const [result] = await Country.updateCountry(id, name);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Country not found' });
      }
      res.status(200).json({ message: 'Country updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating country' });
    }
  },

  // Delete country
  deleteCountry: async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await Country.deleteCountry(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Country not found' });
      }
      res.status(200).json({ message: 'Country deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting country' });
    }
  }
};

module.exports = CountryController;
