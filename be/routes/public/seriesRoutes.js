// routes/movieRoutes.js
const express = require("express");
const SeriesController = require("../../controllers/public/SeriesController");
const router = express.Router();

router.get("/popular", SeriesController.getPopular);
router.get("/", SeriesController.getAll);
router.get("/top-rated", SeriesController.getTopRated);

module.exports = router;
