const { Op } = require("sequelize");
const Series = require("../../models/Series");

class PublicSeriesController {
  // Create a new Series
  static async getPopular(req, res) {
    try {
      const Seriess = await Series.findAll({
        where: {
          is_popular: true,
        },
      });
      return res.status(200).json(Seriess);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get all Seriess
  static async getAll(req, res) {
    console.log("all Seriess");
    try {
      const Seriess = await Series.findAll();
      return res.status(200).json(Seriess);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getTopRated(req, res) {
    try {
      const series = await Series.findAll({
        where: {
          rating: {
            [Op.gt]: 4.4,
          },
        },
      });
      return res.status(200).json(series);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PublicSeriesController;
