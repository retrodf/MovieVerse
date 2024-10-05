const db = require("../library/database");

const MovieController = {
  // Read Movies yang belum di-approve (approval_status = 0)
  getMoviesWithStatusZero: async (req, res) => {
    try {
      const [movies] = await db.query(`
                SELECT movie.*
                FROM movie
                WHERE movie.approval_status = 0
            `);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving unapproved movies" });
    }
  },

  // Read Movies yang sudah di-approve (approval_status = 1)
  getApprovedMovies: async (req, res) => {
    try {
      const [movies] = await db.query(`
                SELECT movie.*
                FROM movie
                WHERE movie.approval_status = 1
            `);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving approved movies" });
    }
  },

  // Read all Movies regardless of approval status
  getAllMovies: async (req, res) => {
    try {
      const [movies] = await db.query(`
        SELECT 
          m.id, m.title, m.rating, m.directorId, m.approval_status, m.countryId, m.release_date, 
          m.synopsis, m.poster_url, m.trailer_url, d.name as director, c.name as country
        FROM 
          movie m
        LEFT JOIN 
          director d ON m.directorId = d.id
        LEFT JOIN 
          country c ON m.countryId = c.countryId
      `);
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving movies", error: error.message });
    }
  },

  // Create Movie baru
  createMovie: async (req, res) => {
    try {
      const {
        title,
        rating,
        directorId,
        countryId,
        release_date,
        synopsis,
        poster_url,
        trailer_url,
      } = req.body;

      // Insert movie ke dalam database
      const [result] = await db.query(
        "INSERT INTO movie (title, rating, directorId, approval_status, countryId, release_date, synopsis, poster_url, trailer_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          rating,
          directorId,
          0,  // Default approval_status is 0 (unapproved)
          countryId,
          release_date,
          synopsis,
          poster_url,
          trailer_url,
        ]
      );

      const newMovieId = result.insertId;
      res.status(201).json({ message: "Movie created", id: newMovieId });
    } catch (error) {
      res.status(500).json({ message: "Error creating movie" });
    }
  },

  // Update approval status
  updateApprovalStatus: async (req, res) => {
    try {
      const { approval_status } = req.body;
      const [result] = await db.query(
        "UPDATE movie SET approval_status = ? WHERE id = ?",
        [approval_status, req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json({ message: "Approval status updated" });
    } catch (error) {
      res.status(500).json({ message: "Error updating approval status" });
    }
  },

  // Delete Movie
  deleteMovie: async (req, res) => {
    try {
      const [result] = await db.query("DELETE FROM movie WHERE id = ?", [
        req.params.id,
      ]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json({ message: "Movie deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting movie" });
    }
  },
};

module.exports = MovieController;
