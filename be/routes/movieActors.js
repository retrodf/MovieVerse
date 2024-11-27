const express = require("express");
const MovieActorController = require("../controllers/MovieActorController");
const router = express.Router();

// Route to add an actor to a movie
router.post("/", MovieActorController.addActorToMovie);

// Route to get all actors for a specific movie
router.get("/movies/:movieId/actors", MovieActorController.getActorsByMovie);

// Route to get all movies for a specific actor
router.get("/actors/:actorId/movies", MovieActorController.getMoviesByActor);

router.delete("/movie-actors", MovieActorController.removeActorFromMovie);

module.exports = router;
