const { Op } = require("sequelize");
const { Country, Movie } = require("../../models");

class CountryControllerPublic {
// Mengambil semua negara tanpa limit
static async getAll(req, res) {
  try {
    const countries = await Country.findAll({
      attributes: ['countryId', 'name'],
    });

    return res.json({ countries });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
}


static async getById(req, res, next) {
  try {
    const countryId = req.params.id;
    if (isNaN(countryId)) {
      return res.status(400).json({ message: "Invalid country ID" });
    }
    const country = await Country.findOne({
      where: { id: countryId },
      include: [{ model: Movie }],
    });
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    return res.json({ country });
  } catch (error) {
    next(error);
  }
}

  // Mengambil semua negara tanpa pagination untuk filter
  static async getAllForFilter(req, res) {
    try {
      const countries = await Country.findAll({
        attributes: ['id', 'name'],
      });
      return res.json(countries);
    } catch (error) {
      console.error("Error fetching countries:", error);
      return res.status(500).json({ message: "Something went wrong!" });
    }
  }  
  
}

module.exports = CountryControllerPublic;
