const { Op } = require("sequelize");
const {
  Movie,
  MovieVideo,
  Director,
  Actor,
  Genre,
  Country,
} = require("../../models/index");

class PublicMovieController {
  static async getPopular(req, res) {
    try {
      const movies = await Movie.findAll({
        where: {
          is_popular: true, // Mengambil film yang ditandai sebagai populer
          approval_status: true, // Hanya mengambil film yang telah disetujui
        },
        include: [
          {
            model: Director,
            as: "Director", // Menggunakan alias "Director"
            attributes: ["id", "name"],
          },
          {
            model: Country,
            as: "Country", // Menggunakan alias "Country"
            attributes: ["countryId", "name"],
          },
          {
            model: Actor,
            as: "Actors", // Menggunakan alias "Actors"
            through: { attributes: [] }, // Menyembunyikan kolom tambahan pada tabel penghubung
            attributes: ["id", "name"],
          },
          {
            model: Genre,
            as: "Genres", // Menggunakan alias "Genres"
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
        ],
      });

      return res.status(200).json(movies);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    console.log("Fetching all approved movies");
    try {
      const movies = await Movie.findAll({
        where: {
          approval_status: true, // Only approved movies
        },
        include: [
          {
            model: Genre,
            as: "Genres",
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
          {
            model: Actor,
            as: "Actors", // Using alias "Actors"
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
        ],
      });
      return res.status(200).json(movies);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get top-rated movies with approval status true
  static async getTopRated(req, res) {
    try {
      const movies = await Movie.findAll({
        where: {
          rating: {
            [Op.gt]: 4.4, // Movies with rating > 4.4
          },
          approval_status: true, // Only approved movies
        },
        include: [
          {
            model: Genre,
            as: "Genres", // Using alias "Genres"
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
        ],
      });
      return res.status(200).json(movies);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong!", error: error.message });
    }
  }

  // Get movie details, including related data, only if approved
  static async getMovieDetail(req, res) {
    try {
      const movie = await Movie.findOne({
        where: {
          id: req.params.id,
          approval_status: true, // Hanya ambil film yang disetujui
        },
        include: [
          {
            model: MovieVideo,
            as: "MovieVideos",
          },
          {
            model: Director,
            as: "Director",
            attributes: ["id", "name"],
          },
          {
            model: Actor,
            as: "Actors",
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
        return res.status(404).json({ error: "Movie not found" });
      }
  
      // Fungsi untuk mengubah URL menjadi format embed YouTube
      const convertToEmbedUrl = (url) => {
        const match = url.match(/watch\?v=([\w-]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : url;
      };
  
      // Konversi URL MovieVideos
      movie.MovieVideos = movie.MovieVideos.map((video) => ({
        ...video,
        url: convertToEmbedUrl(video.url), // Ubah URL sebelum dikirimkan ke frontend
      }));
  
      // Ambil rekomendasi film
      const recommendations = await Movie.findAll({
        where: {
          id: { [Op.ne]: movie.id }, // Kecualikan film ini
          approval_status: true,
        },
        order: [["release_date", "DESC"]],
        limit: 5,
      });
  
      return res.status(200).json({
        movie,
        recommendations,
      });
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  // Menambahkan film baru
  static async addMovie(req, res) {
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
    if (!title || !releaseDate || !country || !genres || !directorId) {
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
        approval_status: 0, // Pending approval
        rating,
      });
  
      // Menambahkan trailer ke MovieVideo
      if (trailers && Array.isArray(trailers) && trailers.length > 0) {
        // Membatasi jumlah trailer yang disimpan, misalnya maksimum 5
        const limitedTrailers = trailers.slice(0, 5);
  
        const trailerPromises = limitedTrailers.map((trailerUrl, index) =>
          MovieVideo.create({
            url: trailerUrl,
            title: `${title} Trailer ${index + 1}`,
            movieId: newMovie.id,
          })
        );
  
        // Menunggu semua trailer selesai disimpan
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
        message: "Movie added successfully and is pending approval",
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

  static async searchMovies(req, res) {
    try {
      const { query, genre, releaseYear, rating, country, sortBy, category } =
        req.query;
      console.log("Query Parameters:", req.query);

      const includeOptions = [];

      // Validasi dan konversi genreId dan countryId
      const genreId = genre && !isNaN(genre) ? parseInt(genre, 10) : null;
      const countryId =
        country && !isNaN(country) ? parseInt(country, 10) : null;

      if (genre && genreId === null) {
        return res.status(400).json({ message: "Invalid genre ID" });
      }

      if (country && countryId === null) {
        return res.status(400).json({ message: "Invalid country ID" });
      }

      const whereClause = {};
      const order = [];

      // Filter berdasarkan query untuk movies
      if (category === "movies") {
        if (query) {
          whereClause.title = { [Op.like]: `%${query}%` };
        }
      }

      // Filter berdasarkan query untuk celebs/actors
      if (category === "celebs") {
        if (query) {
          includeOptions.push({
            model: Actor,
            as: "Actors",
            where: { name: { [Op.like]: `%${query}%` } }, // Filter by actor's name
            required: true, // Ensure that only movies with matching actors are returned
          });
        }
      }

      if (releaseYear) {
        whereClause.release_date = {
          [Op.between]: [`${releaseYear}-01-01`, `${releaseYear}-12-31`],
        };
      }

      if (rating) {
        whereClause.rating = { [Op.gte]: parseFloat(rating) };
      }

      // Filter genre berdasarkan genreId
      if (genreId !== null) {
        includeOptions.push({
          model: Genre,
          as: "Genres",
          where: { id: genreId },
          required: true,
        });
      } else {
        includeOptions.push({
          model: Genre,
          as: "Genres",
          required: false,
        });
      }

      // Filter country berdasarkan countryId
      if (countryId) {
        includeOptions.push({
          model: Country,
          as: "Country",
          where: { countryId: countryId }, // Ensure ID matches schema
          required: true,
        });
      } else {
        includeOptions.push({
          model: Country,
          as: "Country",
          required: false,
        });
      }

      // Include actors for general movies search
      if (category === "movies" || !category) {
        includeOptions.push({
          model: Actor,
          as: "Actors",
          required: false, // Allow movies without actors to be included
        });
      }

      // Sorting berdasarkan sortBy
      switch (sortBy) {
        case "newest":
          order.push(["release_date", "DESC"]);
          break;
        case "oldest":
          order.push(["release_date", "ASC"]);
          break;
        case "rating":
          order.push(["rating", "DESC"]);
          break;
        case "title_asc":
          order.push(["title", "ASC"]);
          break;
        case "title_desc":
          order.push(["title", "DESC"]);
          break;
        default:
          order.push(["release_date", "DESC"]);
      }

      const movies = await Movie.findAndCountAll({
        where: whereClause,
        include: includeOptions,
        order: order,
        distinct: true,
        limit: 100,
      });

      if (!movies.rows || movies.rows.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No movies found",
        });
      }

      return res.status(200).json({
        status: "success",
        count: movies.count,
        data: movies.rows,
      });
    } catch (error) {
      console.error("Error in searchMovies:", error);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while retrieving movies",
        error: error.message,
      });
    }
  }
}

module.exports = PublicMovieController;
