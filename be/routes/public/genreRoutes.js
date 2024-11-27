const express = require('express');
const GenreController = require('../../controllers/public/GenreController');
const router = express.Router();

router.get('/', GenreController.getAll);
router.get("/:id", GenreController.getById);
router.get("/filter", GenreController.getAllForFilter);
router.get("/all", GenreController.getAllForFilter);


module.exports = router;
