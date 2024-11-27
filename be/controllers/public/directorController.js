const { Op } = require("sequelize");
const { Director, Movie, Series } = require("../../models/index");

class DirectorControllerPublic {
  static async getAll(req, res, next) {
    try {
      const { search } = req.query;
  
      const whereClause = search
        ? {
            name: {
              [Op.like]: `%${search}%`,
            },
          }
        : {};
  
      const directors = await Director.findAll({
        where: whereClause,
        attributes: ['id', 'name'], // Hanya mengambil id dan name
      });
  
      return res.json(directors);
    } catch (error) {
      next(error);
    }
  }  

  static async getById(req, res, next) {
    try {
      const director = await Director.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: Movie,
          },
          {
            model: Series,
          },
        ],
      });

      if (!director) {
        return res.status(404).json({ message: "Director not found" });
      }

      return res.json({ director });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DirectorControllerPublic;
