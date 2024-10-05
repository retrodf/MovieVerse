const db = require('../library/database');

const Actor = {
    getAllActors: () => {
        return db.query('SELECT * FROM Actor');
    },
    getActorById: (id) => {
        return db.query('SELECT * FROM Actor WHERE id = ?', [id]);
    },
    createActor: (actor) => {
        const { name, birthdate, countryId, biography } = actor;
        return db.query('INSERT INTO Actor (name, birthdate, countryId, biography) VALUES (?, ?, ?, ?)', [name, birthdate, countryId, biography]);
    },
    updateActor: (id, actor) => {
        const { name, birthdate, countryId, biography } = actor;
        return db.query('UPDATE Actor SET name = ?, birthdate = ?, countryId = ?, biography = ? WHERE id = ?', [name, birthdate, countryId, biography, id]);
    },
    deleteActor: (id) => {
        return db.query('DELETE FROM Actor WHERE id = ?', [id]);
    }
};

module.exports = Actor;