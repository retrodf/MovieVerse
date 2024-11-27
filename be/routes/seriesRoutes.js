// routes/actorRoutes.js
const express = require("express");
const seriesController = require("../controllers/SeriesController");
const router = express.Router();

router.post("/", seriesController.createSeries);
router.get("/", seriesController.getAllSeries);
router.get("/:id", seriesController.getSeriesById);
router.put("/:id", seriesController.updateSeries);
router.delete("/:id", seriesController.deleteSeries);

module.exports = router;
