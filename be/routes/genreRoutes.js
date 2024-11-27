// routes/genreRoutes.js
const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genreController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Routes for genres
router.get("/", genreController.getAllGenres);
router.post("/", genreController.createGenre);
router.get("/:id", genreController.getGenreById);
router.put("/:id", genreController.updateGenre);
router.delete("/:id", genreController.deleteGenre);

module.exports = router;
