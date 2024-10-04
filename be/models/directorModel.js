const db = require("../library/database");

const Director = {
  getAll: async () => {
    const [directors] = await db.query("SELECT * FROM director");
    return directors;
  },
  getById: async (id) => {
    const [director] = await db.query("SELECT * FROM director WHERE id = ?", [id]);
    return director[0];
  },
  create: async (directorData) => {
    const { name, birthdate, countryId, biography } = directorData;
    const [result] = await db.query(
      "INSERT INTO director (name, birthdate, countryId, biography) VALUES (?, ?, ?, ?)",
      [name, birthdate, countryId, biography]
    );
    return result.insertId;
  },
  update: async (id, directorData) => {
    const { name, birthdate, countryId, biography } = directorData;
    const [result] = await db.query(
      "UPDATE director SET name = ?, birthdate = ?, countryId = ?, biography = ? WHERE id = ?",
      [name, birthdate, countryId, biography, id]
    );
    return result.affectedRows;
  },
  delete: async (id) => {
    const [result] = await db.query("DELETE FROM director WHERE id = ?", [id]);
    return result.affectedRows;
  }
};

module.exports = Director;
