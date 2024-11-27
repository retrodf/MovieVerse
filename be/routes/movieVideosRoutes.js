const express = require("express");
const MovieVideoController = require("../controllers/MovieVideoController");
const router = express.Router();

// Route to create a new movie video
router.post("/", MovieVideoController.create);

// Route to get all videos for a specific movie
router.get("/:movieId/videos", MovieVideoController.getVideosByMovie);

// Route to get a specific movie video by id
router.get("/:id", MovieVideoController.getById);

// Route to update a movie video
router.put("/:id", MovieVideoController.update);

// Route to delete a movie video
router.delete("/:id", MovieVideoController.delete);

module.exports = router;
