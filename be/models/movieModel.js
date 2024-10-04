const db = require('../library/database');

const Movie = {
    getAll: async () => {
        const [movies] = await db.query('SELECT * FROM movie');
        return movies;
    },
    getById: async (id) => {
        const [movie] = await db.query('SELECT * FROM movie WHERE id = ?', [id]);
        return movie[0];
    },
    create: async (movieData) => {
        const { title, rating, directorId, approval_status, countryId, release_date, synopsis, poster_url, trailer_url } = movieData;
        const [result] = await db.query(
            'INSERT INTO movie (title, rating, directorId, approval_status, countryId, release_date, synopsis, poster_url, trailer_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [title, rating, directorId, approval_status, countryId, release_date, synopsis, poster_url, trailer_url]
        );
        return result.insertId;
    },
    update: async (id, movieData) => {
        const { title, rating, directorId, approval_status, countryId, release_date, synopsis, poster_url, trailer_url } = movieData;
        const [result] = await db.query(
            'UPDATE movie SET title = ?, rating = ?, directorId = ?, approval_status = ?, countryId = ?, release_date = ?, synopsis = ?, poster_url = ?, trailer_url = ? WHERE id = ?', 
            [title, rating, directorId, approval_status, countryId, release_date, synopsis, poster_url, trailer_url, id]
        );
        return result.affectedRows;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM movie WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Movie;
