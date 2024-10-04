const db = require('../library/database');

class Country {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM country');
    return rows;
  }
}

module.exports = Country;