const express = require('express');
const router = express.Router();
const directorController = require('../controllers/directorController');

// Landing Page Routes (GET only)
router.get('/directors', directorController.getAllDirectors);
router.get('/directors/:id', directorController.getDirectorById);

// CMS Routes (CRUD)
router.get('/cms/directors', directorController.getAllDirectors);
router.post('/cms/directors', directorController.createDirector);
router.put('/cms/directors/:id', directorController.updateDirector);
router.delete('/cms/directors/:id', directorController.deleteDirector);

module.exports = router;
