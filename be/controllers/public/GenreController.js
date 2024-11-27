const { Op } = require("sequelize");
const { Genre, Movie } = require("../../models");

class GenreControllerPublic {
  static async getAll(req, res, next) {
    try {
      // Mengambil semua genre tanpa pagination
      const genres = await Genre.findAll({
        attributes: ['id', 'name'],
      });
  
      return res.json({ genres });
    } catch (error) {
      next(error);
    }
  }  

  static async getById(req, res, next) {
    try {
      const genreId = req.params.id;
      if (isNaN(genreId)) {
        return res.status(400).json({ message: "Invalid genre ID" });
      }
      const genre = await Genre.findOne({
        where: { id: genreId },
        include: [{ model: Movie }],
      });
      if (!genre) {
        return res.status(404).json({ message: "Genre not found" });
      }
      return res.json({ genre });
    } catch (error) {
      next(error);
    }
  }
  
  // Mengambil semua genre tanpa pagination untuk filter
  static async getAllForFilter(req, res) {
    try {
      // Tambahkan log untuk memastikan request diterima dan melihat parameter yang dikirim
      console.log("Request received for fetching genres for filter");
      console.log("Country ID (if applicable):", req.query.country);
      console.log("Genre ID (if applicable):", req.query.genre);
      
      const genres = await Genre.findAll({
        attributes: ['id', 'name'],
      });

      // Log hasil query untuk memastikan data yang didapatkan
      console.log("Genres fetched:", genres);
      return res.json(genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
      return res.status(500).json({ message: "Something went wrong!" });
    }
  }
}

module.exports = GenreControllerPublic;
