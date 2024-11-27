// routes/awardRoutes.js
const express = require("express");
const AwardController = require("../controllers/AwardController");
const router = express.Router();

router.post("/", AwardController.create);
router.get("/", AwardController.getAll);
router.get("/:id", AwardController.getById);
router.put("/:id", AwardController.update);
router.delete("/:id", AwardController.delete);

module.exports = router;
