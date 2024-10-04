const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/movieController');

// CMS routes
router.post('/cms/movies-input', MovieController.createMovie);  // Create new movie

router.get('/cms/movies-approved', MovieController.getAllMovies);  
router.get('/cms/movies-approved', MovieController.getApprovedMovies); // Read movies with approval_status = 1
router.get('/cms/movies-unapproved', MovieController.getMoviesWithStatusZero);  // Read movies with approval_status = 0
router.put('/cms/movies-approved/:id', MovieController.updateApprovalStatus);  // Update approval status
router.delete('/cms/movies-approved/:id', MovieController.deleteMovie);  // Delete movie

router.get('/cms/movies', MovieController.getAllMovies);

// Landing Page Routes
router.get('/home', MovieController.getApprovedMovies);
router.get('/movie', MovieController.getApprovedMovies);

module.exports = router;
