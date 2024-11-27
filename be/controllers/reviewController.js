// controllers/ReviewController.js
const Review = require("../models/Review");
const User = require("../models/User");
const Movie = require("../models/Movie"); // Import the Movie model

// controllers/ReviewController.js
class reviewController {
  // Add a new review
  static async addReview(req, res) {
    try {
      const { content, rating, movieId, userId } = req.body;
      console.log("Data diterima di backend:", { content, rating, movieId, userId });

      if (!content || !rating || !movieId || !userId) {
        console.log("Incomplete data:", { content, rating, movieId, userId });
        return res.status(400).json({ message: "All fields are required" });
      }

      const newReview = await Review.create({ content, rating, movieId, userId });
      return res.status(201).json(newReview);
    } catch (error) {
      console.error("Error adding review:", error);
      return res.status(500).json({ message: "Failed to add review" });
    }
  }

  // Get reviews for a specific movie// controllers/ReviewController.js

static async getReviewsByMovieId(req, res) {
  try {
    const { movieId } = req.params;
    const reviews = await Review.findAll({
      where: { movieId },
      include: [
        {
          model: User,
          as: "User", // Gunakan alias yang sesuai
          attributes: ["username"],
        },
        {
          model: Movie,
          as: "Movie",
          attributes: ["title"],
        },
      ],
      attributes: ["id", "content", "rating", "createdAt", "status"],
    });
    if (!reviews) {
      return res.status(404).json({ message: "No reviews found" });
    }

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
}

static async getAllReviews(req, res) {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, as: "User", attributes: ["username"] }, // Gunakan alias yang sesuai
        { model: Movie, as: "Movie", attributes: ["title"] }
      ],
      attributes: ["id", "content", "rating", "status", "createdAt"]
    });
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
}

  static async approveReview(req, res) {
    const { id } = req.params;
    try {
      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      review.status = "Approved";
      await review.save();
      return res.status(200).json({ message: "Review approved successfully" });
    } catch (error) {
      console.error("Error approving review:", error);
      return res.status(500).json({ message: "Failed to approve review" });
    }
  }

  static async deleteReview(req, res) {
    const { id } = req.params;
    try {
      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      await review.destroy();
      return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      return res.status(500).json({ message: "Failed to delete review" });
    }
  }
}

module.exports = reviewController;
