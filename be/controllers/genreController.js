const db = require('../library/database');

const genreController = {
    // Read all genres
    getAllGenres: async (req, res) => {
        try {
            const [genres] = await db.query('SELECT * FROM genre');
            res.json(genres);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving genres' });
        }
    },

    // Create new genre
    createGenre: async (req, res) => {
        try {
            const { name } = req.body;
            const [result] = await db.query('INSERT INTO genre (name) VALUES (?)', [name]);
            res.status(201).json({ message: 'Genre created', id: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Error creating genre' });
        }
    }
};

module.exports = genreController;
