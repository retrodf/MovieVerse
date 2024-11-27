const express = require("express");
const MovieController = require("../controllers/MovieController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Endpoint untuk admin (Approve movie)
router.put("/:id/approve", authMiddleware, roleMiddleware(["admin"]), MovieController.approveMovie);

// Endpoint untuk user dan admin (Add movie)
router.post("/add", authMiddleware, MovieController.create);

// Endpoint untuk public (Get all movies)
router.get("/", MovieController.getAll);

// Endpoint untuk public (Get movie by ID)
router.get("/:id", MovieController.getById);

// Endpoint untuk admin (Update movie)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), MovieController.update);

// Endpoint untuk admin (Delete movie)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), MovieController.delete);

// Endpoint untuk public (Get all approved movies)
router.get("/approved", MovieController.getAllApproved);

module.exports = router;
