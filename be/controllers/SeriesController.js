const Series = require("../models/Series"); // Import model Series

class SeriesController {
  // Create a new series
  async createSeries(req, res) {
    try {
      const {
        title,
        rating,
        directorId,
        approval_status,
        countryId,
        release_date,
        synopsis,
        seasons,
        episodes,
        poster_url,
        trailer_url,
        is_popular
      } = req.body;

      const newSeries = await Series.create({
        title,
        rating,
        directorId,
        approval_status,
        countryId,
        release_date,
        synopsis,
        seasons,
        episodes,
        poster_url,
        trailer_url,
        is_popular
      });

      res.status(201).json({
        message: "Series created successfully",
        data: newSeries,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating series",
        error: error.message,
      });
    }
  }

  // Get all series
  async getAllSeries(req, res) {
    try {
      const seriesList = await Series.findAll();
      res.status(200).json({
        message: "Series retrieved successfully",
        data: seriesList,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving series",
        error: error.message,
      });
    }
  }

  // Get a series by ID
  async getSeriesById(req, res) {
    try {
      const { id } = req.params;
      const series = await Series.findByPk(id);

      if (series) {
        res.status(200).json({
          message: "Series retrieved successfully",
          data: series,
        });
      } else {
        res.status(404).json({
          message: "Series not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving series",
        error: error.message,
      });
    }
  }

  // Update a series
  async updateSeries(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        rating,
        directorId,
        approval_status,
        countryId,
        release_date,
        synopsis,
        seasons,
        episodes,
        poster_url,
        trailer_url,
        is_popular
      } = req.body;

      const series = await Series.findByPk(id);

      if (series) {
        await series.update({
          title,
          rating,
          directorId,
          approval_status,
          countryId,
          release_date,
          synopsis,
          seasons,
          episodes,
          poster_url,
          trailer_url,
        });

        res.status(200).json({
          message: "Series updated successfully",
          data: series,
        });
      } else {
        res.status(404).json({
          message: "Series not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating series",
        error: error.message,
      });
    }
  }

  // Delete a series
  async deleteSeries(req, res) {
    try {
      const { id } = req.params;

      const series = await Series.findByPk(id);

      if (series) {
        await series.destroy();
        res.status(200).json({
          message: "Series deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "Series not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting series",
        error: error.message,
      });
    }
  }
}

module.exports = new SeriesController();
