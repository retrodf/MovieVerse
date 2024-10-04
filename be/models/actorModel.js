const db = require('../library/database');

const Actor = {
  getAll: async () => {
    try {
      const [actors] = await db.query('SELECT * FROM actor');
      return actors;
    } catch (error) {
      console.error("Database error fetching actors:", error);  // Log jika ada error
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const [actor] = await db.query("SELECT * FROM actor WHERE id = ?", [id]);
      return actor[0];
    } catch (error) {
      console.error("Database error fetching actor by ID:", error);  // Log error jika ada
      throw error;
    }
  },

  create: async (actorData) => {
    try {
      const { name, birthdate, countryId, biography } = actorData;
      const [result] = await db.query(
        "INSERT INTO actor (name, birthdate, countryId, biography) VALUES (?, ?, ?, ?)",
        [name, birthdate, countryId, biography]
      );
      return result.insertId;
    } catch (error) {
      console.error("Database error creating actor:", error);  // Log jika ada error
      throw error;
    }
  },

  update: async (id, actorData) => {
    try {
      const { name, birthdate, countryId, biography } = actorData;
      const [result] = await db.query(
        "UPDATE actor SET name = ?, birthdate = ?, countryId = ?, biography = ? WHERE id = ?",
        [name, birthdate, countryId, biography, id]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Database error updating actor:", error);  // Log jika ada error
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const [result] = await db.query("DELETE FROM actor WHERE id = ?", [id]);
      return result.affectedRows;
    } catch (error) {
      console.error("Database error deleting actor:", error);  // Log jika ada error
      throw error;
    }
  },
};

module.exports = Actor;
