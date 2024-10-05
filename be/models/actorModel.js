const db = require('../library/database');

const Actor = {
  getAllActors: () => {
    return db.query(
      `SELECT 
        a.id, a.name, a.birthdate, c.name as country, a.biography
      FROM 
        actor a
      LEFT JOIN 
        country c ON a.countryId = c.countryId`
    );
  },
  getActorById: (id) => {
    return db.query(
      'SELECT id, name, birthdate, countryId, biography FROM actor WHERE id = ?',
      [id]
    );
  },
  createActor: (actor) => {
    const { name, birthdate, countryId, biography } = actor;
    return db.query(
      'INSERT INTO actor (name, birthdate, countryId, biography) VALUES (?, ?, ?, ?)',
      [name, birthdate, countryId, biography]
    );
  },
  updateActor: (id, actor) => {
    const { name, birthdate, countryId, biography } = actor;
    return db.query(
      'UPDATE actor SET name = ?, birthdate = ?, countryId = ?, biography = ? WHERE id = ?',
      [name, birthdate, countryId, biography, id]
    );
  },
  deleteActor: (id) => {
    return db.query('DELETE FROM actor WHERE id = ?', [id]);
  }
};

module.exports = Actor;
