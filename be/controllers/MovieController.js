const {
  Movie,
  Director,
  Country,
  Actor,
  Genre,
  MovieVideo,
} = require("../models");

class MovieController {
  // Create a new movie
  static async create(req, res) {
    const {
      title,
      releaseDate,
      country,
      synopsis,
      genres,
      actors,
      trailers, // Ubah dari 'trailer' menjadi 'trailers'
      poster,
      directorId,
      rating,
    } = req.body;

    const userId = req.userId; // Mendapatkan userId dari middleware

    // Validasi input
    if (
      !title ||
      !releaseDate ||
      !country ||
      !genres ||
      !directorId ||
      !poster
    ) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    try {
      // Membuat entri film baru
      const newMovie = await Movie.create({
        title,
        release_date: releaseDate,
        countryId: country,
        synopsis,
        poster_url: poster,
        directorId,
        addedBy: userId,
        approval_status: 1, // Langsung disetujui karena admin yang menambahkan
        rating,
      });

      // Menambahkan trailer ke MovieVideo
      if (trailers && Array.isArray(trailers) && trailers.length > 0) {
        const limitedTrailers = trailers.slice(0, 5);

        const trailerPromises = limitedTrailers.map((trailerUrl, index) =>
          MovieVideo.create({
            url: trailerUrl,
            title: `${title} Trailer ${index + 1}`,
            movieId: newMovie.id,
          })
        );

        await Promise.all(trailerPromises);
      }

      if (genres && genres.length > 0) {
        await newMovie.setGenres(genres.slice(0, 10)); // Membatasi jumlah genre
      }

      if (actors && actors.length > 0) {
        await newMovie.setActors(actors.slice(0, 10)); // Membatasi jumlah aktor
      }

      return res.status(201).json({
        status: "success",
        message: "Movie added successfully",
        movie: newMovie,
      });
    } catch (error) {
      console.error("Error during movie creation:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to add movie",
        error: error.message,
      });
    }
  }

  // Get all movies
  static async getAll(req, res) {
    try {
      const movies = await Movie.findAll({
        include: [
          {
            model: Director,
            as: "Director",
            attributes: ["id", "name"],
          },
          {
            model: Country,
            as: "Country",
            attributes: ["countryId", "name"],
          },
          {
            model: Actor,
            as: "Actors",
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
          {
            model: Genre,
            as: "Genres",
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
        ],
      });

      return res.status(200).json(movies);
    } catch (error) {
      console.error("Error in fetching movies:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Get a movie by ID
  static async getById(req, res) {
    try {
      const movie = await Movie.findByPk(req.params.id, {
        include: [
          {
            model: Director,
            as: "Director",
            attributes: ["id", "name"],
          },
          {
            model: Country,
            as: "Country",
            attributes: ["countryId", "name"],
          },
          {
            model: Actor,
            as: "Actors",
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
          {
            model: Genre,
            as: "Genres",
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
        ],
      });

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      return res.status(200).json(movie);
    } catch (error) {
      console.error("Error in fetching movie by ID:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Update a movie
  static async update(req, res) {
    const {
      title,
      releaseDate,
      country,
      synopsis,
      genres,
      actors,
      trailers,
      poster,
      directorId,
      rating,
    } = req.body;

    try {
      // Ambil movieId dari parameter
      const movieId = req.params.id;

      // Cari film berdasarkan movieId
      const movie = await Movie.findByPk(movieId);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      // Update data film
      await movie.update({
        title,
        release_date: releaseDate,
        countryId: country,
        synopsis,
        poster_url: poster,
        directorId,
        rating,
      });

      // Update genres
      if (genres && genres.length > 0) {
        await movie.setGenres(genres.slice(0, 10));
      } else {
        await movie.setGenres([]);
      }

      // Update actors
      if (actors && actors.length > 0) {
        await movie.setActors(actors.slice(0, 10));
      } else {
        await movie.setActors([]);
      }

      // Update trailers
      if (trailers && Array.isArray(trailers)) {
        await MovieVideo.destroy({ where: { movieId } });

        const trailerPromises = trailers.map((trailer) => {
          if (!trailer.title || !trailer.url) {
            throw new Error("Trailer must have a title and URL");
          }
          return MovieVideo.create({
            movieId,
            url: trailer.url,
            title: trailer.title,
          });
        });

        await Promise.all(trailerPromises);
      }

      // Ambil data film yang sudah diupdate beserta asosiasinya
      const updatedMovie = await Movie.findByPk(movieId, {
        include: [
          {
            model: Director,
            as: "Director",
            attributes: ["id", "name"],
          },
          {
            model: Country,
            as: "Country",
            attributes: ["countryId", "name"],
          },
          {
            model: Actor,
            as: "Actors",
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
          {
            model: Genre,
            as: "Genres",
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
          {
            model: MovieVideo,
            as: "MovieVideos",
            attributes: ["id", "url", "title"],
          },
        ],
      });

      // Return sukses
      return res.status(200).json({
        status: "success",
        message: "Movie updated successfully",
        movie: updatedMovie,
      });
    } catch (error) {
      console.error("Error updating movie:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to update movie",
        error: error.message,
      });
    }
  }

  // Update approval status
  static async updateApprovalStatus(req, res) {
    try {
      const { id } = req.params;
      const { approval_status } = req.body;

      if (
        typeof approval_status !== "boolean" &&
        approval_status !== 0 &&
        approval_status !== 1
      ) {
        return res
          .status(400)
          .json({ message: "Invalid approval status value" });
      }

      const [updated] = await Movie.update(
        { approval_status },
        { where: { id } }
      );

      if (!updated) {
        return res.status(404).json({ message: "Movie not found" });
      }

      const updatedMovie = await Movie.findByPk(id, {
        attributes: ["id", "title", "approval_status"],
      });

      return res.status(200).json({
        message: "Approval status updated successfully",
        movie: updatedMovie,
      });
    } catch (error) {
      console.error("Error updating approval status:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Delete a movie
  // Delete a movie
  static async delete(req, res) {
    try {
      const movie = await Movie.findByPk(req.params.id);

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      // Hapus asosiasi dengan genres dan actors
      await movie.setGenres([]);
      await movie.setActors([]);

      // Hapus trailers terkait
      await MovieVideo.destroy({ where: { movieId: movie.id } });

      // Hapus film
      await movie.destroy();

      return res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
      console.error("Error deleting movie:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to delete movie",
        error: error.message,
      });
    }
  }

  // Get all approved movies (hanya film yang sudah di-approve)
  static async getAllApproved(req, res) {
    try {
      const movies = await Movie.findAll({
        where: {
          approval_status: 1,
        },
        include: [
          {
            model: Director,
            as: "Director",
            attributes: ["id", "name"],
          },
          {
            model: Country,
            as: "Country",
            attributes: ["countryId", "name"],
          },
          {
            model: Actor,
            as: "Actors",
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
          {
            model: Genre,
            as: "Genres",
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
        ],
      });

      return res.status(200).json(movies);
    } catch (error) {
      console.error("Error in fetching approved movies:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Approve a movie
  static async approveMovie(req, res) {
    try {
      const movieId = req.params.id;

      // Cari film yang akan di-approve
      const movie = await Movie.findByPk(movieId);

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      // Update approval_status
      movie.approval_status = 1;
      await movie.save();

      // Dapatkan data film yang telah diupdate beserta asosiasinya
      const updatedMovie = await Movie.findByPk(movieId, {
        include: [
          {
            model: Director,
            as: "Director",
            attributes: ["id", "name"],
          },
          {
            model: Country,
            as: "Country",
            attributes: ["countryId", "name"],
          },
          {
            model: Actor,
            as: "Actors",
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
          {
            model: Genre,
            as: "Genres",
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
        ],
      });

      return res.status(200).json({
        message: "Movie approved successfully",
        movie: updatedMovie,
      });
    } catch (error) {
      console.error("Error approving movie:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MovieController;
