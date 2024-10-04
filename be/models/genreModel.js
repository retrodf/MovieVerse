const db = require('../library/database');

class Genre {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM genre');
    return rows;
  }
}

module.exports = Genre;