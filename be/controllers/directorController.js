const db = require("../library/database");

const DirectorController = {
  // Get all directors
  getAllDirectors: async (req, res) => {
    try {
      const [directors] = await db.query("SELECT * FROM director");
      res.json(directors);
    } catch (error) {
      console.error(error); // Tambahkan ini
      res.status(500).json({ message: "Error retrieving directors" });
    }
  },

  // Create new director
  createDirector: async (req, res) => {
    try {
      const { name, birthdate, countryId, biography } = req.body;
      const [result] = await db.query(
        "INSERT INTO director (name, birthdate, countryId, biography) VALUES (?, ?, ?, ?)",
        [name, birthdate, countryId, biography]
      );
      res.status(201).json({ message: "Director created", id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: "Error creating director" });
    }
  },

  // Update director by id
  updateDirector: async (req, res) => {
    try {
      const { name, birthdate, countryId, biography } = req.body;
      const [result] = await db.query(
        "UPDATE director SET name = ?, birthdate = ?, countryId = ?, biography = ? WHERE id = ?",
        [name, birthdate, countryId, biography, req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Director not found" });
      }
      res.json({ message: "Director updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating director" });
    }
  },

  // Delete director by id
  deleteDirector: async (req, res) => {
    try {
      const [result] = await db.query("DELETE FROM director WHERE id = ?", [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Director not found" });
      }
      res.json({ message: "Director deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting director" });
    }
  }
};

module.exports = DirectorController;
