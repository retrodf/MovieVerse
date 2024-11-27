// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/reviewController");

router.get("/", ReviewController.getAllReviews);
router.put("/:id/approve", ReviewController.approveReview);
router.delete("/:id", ReviewController.deleteReview);

// Route untuk menambahkan review
router.post("/add", ReviewController.addReview);

// Route untuk mendapatkan semua review dari movie tertentu
router.get("/:movieId", ReviewController.getReviewsByMovieId);


module.exports = router;
