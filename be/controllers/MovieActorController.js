const { MovieActor, Movie, Actor } = require("../models/index");

class MovieActorController {
  static async addActorToMovie(req, res) {
    const { movieId, actorId } = req.body;
    try {
      // Check if both the movie and actor exist
      const movie = await Movie.findByPk(movieId);
      const actor = await Actor.findByPk(actorId);

      if (!movie || !actor) {
        return res.status(404).json({ message: "Movie or Actor not found" });
      }

      const movieActor = await MovieActor.create({ movieId, actorId });
      return res.status(201).json(movieActor);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get all actors for a specific movie
  static async getActorsByMovie(req, res) {
    const { movieId } = req.params;

    try {
      const movie = await Movie.findByPk(movieId, {
        include: [{ model: Actor }],
      });

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      return res.status(200).json(movie.Actors);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get all movies for a specific actor
  static async getMoviesByActor(req, res) {
    const { actorId } = req.params;

    try {
      const actor = await Actor.findByPk(actorId, {
        include: [{ model: Movie }],
      });

      if (!actor) {
        return res.status(404).json({ message: "Actor not found" });
      }

      return res.status(200).json(actor.Movies);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async removeActorFromMovie(req, res) {
    const { movieId, actorId } = req.body;

    try {
      const movieActor = await MovieActor.findOne({
        where: { movieId, actorId },
      });

      if (!movieActor) {
        return res
          .status(404)
          .json({ message: "Actor not found in this movie" });
      }

      await movieActor.destroy();
      return res.status(200).json({ message: "Actor removed from movie" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MovieActorController;
