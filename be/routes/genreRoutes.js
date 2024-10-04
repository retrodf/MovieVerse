const express = require('express');
const router = express.Router();
const GenreController = require('../controllers/genreController');

// CMS routes
router.get('/cms/genres', GenreController.getAllGenres);  // Read all genres
router.post('/cms/genres', GenreController.createGenre);  // Create new genre

module.exports = router;
