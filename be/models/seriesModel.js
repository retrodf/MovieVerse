const db = require('../library/database');

const Series = {
  getAll: async () => {
    const [series] = await db.query('SELECT * FROM series');
    return series;
  },

  getById: async (id) => {
    const [series] = await db.query('SELECT * FROM series WHERE id = ?', [id]);
    return series[0];
  },

  create: async (seriesData) => {
    const {
      title, rating, directorId, approval_status, countryId, release_date,
      synopsis, seasons, episodes, poster_url, trailer_url
    } = seriesData;
    const [result] = await db.query(
      `INSERT INTO series 
      (title, rating, directorId, approval_status, countryId, release_date, synopsis, seasons, episodes, poster_url, trailer_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, rating, directorId, approval_status, countryId, release_date, synopsis, seasons, episodes, poster_url, trailer_url]
    );
    return result.insertId;
  },

  update: async (id, seriesData) => {
    const {
      title, rating, directorId, approval_status, countryId, release_date,
      synopsis, seasons, episodes, poster_url, trailer_url
    } = seriesData;
    const [result] = await db.query(
      `UPDATE series SET title = ?, rating = ?, directorId = ?, approval_status = ?, 
      countryId = ?, release_date = ?, synopsis = ?, seasons = ?, episodes = ?, poster_url = ?, trailer_url = ? 
      WHERE id = ?`,
      [title, rating, directorId, approval_status, countryId, release_date, synopsis, seasons, episodes, poster_url, trailer_url, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM series WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Series;
