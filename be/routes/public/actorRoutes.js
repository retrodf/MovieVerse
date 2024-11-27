// routes/movieRoutes.js
const express = require("express");
const ActorController = require("../../controllers/public/ActorController");
const router = express.Router();

router.get("/", ActorController.getAll);
router.get("/:id", ActorController.getById);

module.exports = router;
