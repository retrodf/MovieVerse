// controllers/DirectorController.js
const { Op } = require("sequelize");
const Director = require("../models/Director");

class DirectorController {
  // Create a new director
  static async create(req, res) {
    try {
      const director = await Director.create(req.body);
      return res.status(201).json(director);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get all directors
  static async getAll(req, res) {
    try {
      const { search = "" } = req.query;

      const directors = await Director.findAll({
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        attributes: ["id", "name"], // Hanya mengambil id dan name
      });

      return res.status(200).json(directors);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get a director by ID
  static async getById(req, res) {
    try {
      const director = await Director.findByPk(req.params.id);
      if (!director) {
        return res.status(404).json({ message: "Director not found" });
      }
      return res.status(200).json(director);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Update a director
  static async update(req, res) {
    try {
      const [updated] = await Director.update(req.body, {
        where: { id: req.params.id },
      });
      if (!updated) {
        return res.status(404).json({ message: "Director not found" });
      }
      const updatedDirector = await Director.findByPk(req.params.id);
      return res.status(200).json(updatedDirector);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Delete a director
  static async delete(req, res) {
    try {
      const deleted = await Director.destroy({
        where: { id: req.params.id },
      });
      if (!deleted) {
        return res.status(404).json({ message: "Director not found" });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DirectorController;
