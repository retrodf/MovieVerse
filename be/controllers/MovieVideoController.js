const { MovieVideo, Movie } = require("../models/index");

class MovieVideoController {
  // Create a new movie video
  static async create(req, res) {
    const { url, title, movieId } = req.body;

    try {
      const movie = await Movie.findByPk(movieId);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      const newVideo = await MovieVideo.create({ url, title, movieId });
      return res.status(201).json(newVideo);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get all videos for a specific movie
  static async getVideosByMovie(req, res) {
    try {
      const { movieId } = req.params;

      // Fetch movie dan sertakan MovieVideos dengan alias
      const movie = await Movie.findByPk(movieId, {
        include: [{ model: MovieVideo, as: "MovieVideos" }],
      });
      console.log("Fetched MovieVideos:", movie.MovieVideos);      

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      return res.status(200).json(movie.MovieVideos); // Akses berdasarkan alias
    } catch (error) {
      console.error("Error fetching videos:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const video = await MovieVideo.findByPk(id);

      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      return res.status(200).json(video);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Bagian dari controller untuk update movie
  static async update(req, res) {
    const {
      title,
      rating,
      synopsis,
      releaseDate,
      directorId,
      country,
      actors,
      genres,
      poster,
      trailers,
    } = req.body;

    try {
      const movieId = req.params.id;

      // Update movie fields
      const movie = await Movie.findByPk(movieId);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      await movie.update({
        title,
        rating,
        synopsis,
        releaseDate,
        directorId,
        countryId: country,
        poster,
      });

      // Update genres
      if (genres && genres.length) {
        await movie.setGenres(genres);
      }

      // Update actors
      if (actors && actors.length) {
        await movie.setActors(actors);
      }

      // Handle trailers
      if (trailers && Array.isArray(trailers)) {
        for (const trailer of trailers) {
          if (trailer.id) {
            // Update existing trailer
            const existingTrailer = await MovieVideo.findByPk(trailer.id);
            if (existingTrailer) {
              await existingTrailer.update({ url: trailer.url });
            }
          } else if (trailer.url) {
            // Create new trailer
            await MovieVideo.create({ movieId, url: trailer.url });
          }
        }
      }

      return res.status(200).json({ message: "Movie updated successfully" });
    } catch (error) {
      console.error("Error updating movie:", error);
      return res
        .status(500)
        .json({
          status: "error",
          message: "Failed to update movie",
          error: error.message,
        });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const video = await MovieVideo.findByPk(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      await video.destroy();
      return res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MovieVideoController;
