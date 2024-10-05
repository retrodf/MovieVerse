const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');

// Landing Page Routes (GET only)
router.get('/actors', actorController.getAllActors);
router.get('/actors/:id', actorController.getActorById);

// CMS Routes (CRUD)
router.get('/cms/actors', actorController.getAllActors);
router.post('/cms/actors', actorController.createActor);
router.put('/cms/actors/:id', actorController.updateActor);
router.delete('/cms/actors/:id', actorController.deleteActor);

module.exports = router;
