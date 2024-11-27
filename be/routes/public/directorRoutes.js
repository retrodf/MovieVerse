// routes/movieRoutes.js
const express = require("express");
const DirectorController = require("../../controllers/public/directorController");
const router = express.Router();

router.get("/", DirectorController.getAll);
router.get("/:id", DirectorController.getById);

module.exports = router;
