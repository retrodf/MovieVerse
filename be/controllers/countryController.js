const db = require('../library/database');

const CountryController = {
    // Read all countries
    getAllCountries: async (req, res) => {
        try {
            const [countries] = await db.query('SELECT * FROM country');
            res.json(countries);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving countries' });
        }
    },

    // Create new country
    createCountry: async (req, res) => {
        try {
            const { name } = req.body;
            const [result] = await db.query('INSERT INTO country (name) VALUES (?)', [name]);
            res.status(201).json({ message: 'Country created', id: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Error creating country' });
        }
    }
};

module.exports = CountryController;
