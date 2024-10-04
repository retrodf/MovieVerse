const Actor = require('../models/Actor');

const actorController = {
  getAllActors: async (req, res) => {
    try {
      const actors = await Actor.getAll();
      res.json(actors);
    } catch (error) {
      console.error("Error fetching actors:", error);  // Log lebih detail
      res.status(500).json({ message: "Error retrieving actors" });
    }
  },

  getActorById: async (req, res) => {
    try {
      const actor = await Actor.getById(req.params.id);
      if (!actor) return res.status(404).json({ message: "Actor not found" });
      res.json(actor);
    } catch (error) {
      console.error("Error fetching actor by ID:", error);  // Log lebih detail
      res.status(500).json({ message: "Error retrieving actor" });
    }
  },

  createActor: async (req, res) => {
    try {
      const { name, birthdate, countryId, biography } = req.body;

      if (!countryId) {
        return res.status(400).json({ message: "Country ID is required." });
      }

      const actorId = await Actor.create({ name, birthdate, countryId, biography });
      res.status(201).json({ message: 'Actor created successfully', id: actorId });
    } catch (error) {
      console.error("Error creating actor:", error);  // Log lebih detail
      res.status(500).json({ message: "Error creating actor" });
    }
  },

  updateActor: async (req, res) => {
    try {
      const updated = await Actor.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: "Actor not found" });
      res.json({ message: "Actor updated" });
    } catch (error) {
      console.error("Error updating actor:", error);  // Log lebih detail
      res.status(500).json({ message: "Error updating actor" });
    }
  },

  deleteActor: async (req, res) => {
    try {
      const deleted = await Actor.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Actor not found" });
      res.json({ message: "Actor deleted" });
    } catch (error) {
      console.error("Error deleting actor:", error);  // Log lebih detail
      res.status(500).json({ message: "Error deleting actor" });
    }
  },
};

module.exports = actorController;
