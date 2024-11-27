// controllers/AwardController.js
const Award = require("../models/Award");
const Country = require("../models/Country");

class AwardController {
  // Create a new award
  static async create(req, res) {
    try {
      const { name, year, countryId } = req.body;
      const award = await Award.create({ name, year, countryId });
      return res.status(201).json(award);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get all awards
  static async getAll(req, res) {
    try {
      const awards = await Award.findAll({
        include: {
          model: Country,
          as: "country",
        },
      });
      return res.status(200).json(awards);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get an award by ID
  static async getById(req, res) {
    try {
      const award = await Award.findByPk(req.params.id, {
        include: {
          model: Country,
          as: "country",
        },
      });
      if (!award) {
        return res.status(404).json({ message: "Award not found" });
      }
      return res.status(200).json(award);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Update an award
  static async update(req, res) {
    try {
      const [updated] = await Award.update(req.body, {
        where: { id: req.params.id },
      });
      if (!updated) {
        return res.status(404).json({ message: "Award not found" });
      }
      const updatedAward = await Award.findByPk(req.params.id, {
        include: {
          model: Country,
          as: "country",
        },
      });
      return res.status(200).json(updatedAward);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Delete an award
  static async delete(req, res) {
    try {
      const deleted = await Award.destroy({
        where: { id: req.params.id },
      });
      if (!deleted) {
        return res.status(404).json({ message: "Award not found" });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AwardController;
