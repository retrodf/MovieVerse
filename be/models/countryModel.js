const db = require('../library/database');

const Country = {
  getAllCountries: () => {
    return db.query('SELECT * FROM country');
  },

  getCountryById: (id) => {
    return db.query('SELECT * FROM country WHERE countryId = ?', [id]);
  },

  createCountry: (name) => {
    return db.query('INSERT INTO country (name) VALUES (?)', [name]);
  },

  updateCountry: (id, name) => {
    return db.query('UPDATE country SET name = ? WHERE countryId = ?', [name, id]);
  },

  deleteCountry: (id) => {
    return db.query('DELETE FROM country WHERE countryId = ?', [id]);
  }
};

module.exports = Country;
