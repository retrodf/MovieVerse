const db = require("../library/database");

const Director = {
  getAllDirectors: async () => {
    return db.query(`
      SELECT 
        d.id, d.name, d.birthdate, c.name as country, d.biography
      FROM 
        director d
      LEFT JOIN 
        country c ON d.countryId = c.countryId
    `);
  },

  getDirectorById: async (id) => {
    return db.query(
      `
      SELECT 
        d.id, d.name, d.birthdate, c.name as country, d.biography
      FROM 
        director d
      LEFT JOIN 
        country c ON d.countryId = c.countryId
      WHERE d.id = ?
    `,
      [id]
    );
  },

  createDirector: async (directorData) => {
    const { name, birthdate, countryId, biography } = directorData;
    return db.query(
      `INSERT INTO director (name, birthdate, countryId, biography) VALUES (?, ?, ?, ?)`,
      [name, birthdate, countryId, biography]
    );
  },

  updateDirector: async (id, directorData) => {
    const { name, birthdate, countryId, biography } = directorData;
    return db.query(
      `UPDATE director SET name = ?, birthdate = ?, countryId = ?, biography = ? WHERE id = ?`,
      [name, birthdate, countryId, biography, id]
    );
  },

  deleteDirector: async (id) => {
    return db.query(`DELETE FROM director WHERE id = ?`, [id]);
  },
};

module.exports = Director;
