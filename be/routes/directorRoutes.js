const express = require('express');
const router = express.Router();
const directorController = require('../controllers/directorController');

// Routes for CMS (CRUD operations)

// Mendapatkan semua directors
router.get('/cms/directors', directorController.getAllDirectors);

// Mendapatkan director berdasarkan ID
router.get('/cms/directors/:id', directorController.getDirectorById);

// Menambahkan director baru
router.post('/cms/directors', directorController.createDirector);

// Memperbarui director berdasarkan ID
router.put('/cms/directors/:id', directorController.updateDirector);

// Menghapus director berdasarkan ID
router.delete('/cms/directors/:id', directorController.deleteDirector);

module.exports = router;
