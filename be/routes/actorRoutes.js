// routes/actorRoutes.js
const express = require("express");
const ActorController = require("../controllers/ActorController");
const router = express.Router();

router.post("/", ActorController.create);
router.get("/", ActorController.getAll);
router.get("/:id", ActorController.getById);
router.put("/:id", ActorController.update);
router.delete("/:id", ActorController.delete);

module.exports = router;
