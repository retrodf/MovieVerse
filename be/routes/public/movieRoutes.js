const express = require("express");
const router = express.Router();
const PublicMovieController = require("../../controllers/public/MovieController");
const { authMiddleware } = require("../../middlewares/authMiddleware"); // Impor authMiddleware

router.get("/search", PublicMovieController.searchMovies); // Route untuk search
router.get("/toprated", PublicMovieController.getTopRated);
router.get("/popular", PublicMovieController.getPopular);
router.get("/:id", PublicMovieController.getMovieDetail);
router.get("/", PublicMovieController.getAll);

router.post("/add", authMiddleware, PublicMovieController.addMovie); // Gunakan authMiddleware di route add movie

module.exports = router;
