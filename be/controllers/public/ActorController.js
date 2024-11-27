const { Op } = require("sequelize");
const { Actor, Movie, Country } = require("../../models/index");

class ActorControllerPublic {
  static async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const offset = (page - 1) * limit;

      // Filter pencarian case-insensitive menggunakan MySQL
      const { count, rows: actors } = await Actor.findAndCountAll({
        where: {
          name: {
            [Op.like]: `%${search}%`, // Menggunakan Op.like untuk pencarian case-insensitive di MySQL
          },
        },
        offset: parseInt(offset),
        limit: parseInt(limit),
      });

      return res.json({
        actors,
        meta: {
          totalItems: count,
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const actor = await Actor.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: Movie,
            as: "Movies",
          },
          {
            model: Country,
            as: "Country", // Tambahkan relasi dengan Country
            attributes: ["countryId", "name"], // Mengambil data countryId dan name
          },
        ],
      });

      if (!actor) {
        return res.status(404).json({ message: "Actor not found" });
      }

      return res.json({ actor });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActorControllerPublic;
