// routes/directorRoutes.js
const express = require("express");
const DirectorController = require("../controllers/DirectorController");
const router = express.Router();

router.post("/", DirectorController.create);
router.get("/", DirectorController.getAll);
router.get("/:id", DirectorController.getById);
router.put("/:id", DirectorController.update);
router.delete("/:id", DirectorController.delete);

module.exports = router;
