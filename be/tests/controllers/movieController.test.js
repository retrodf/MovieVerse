const MovieController = require("../../controllers/MovieController");
const { Movie, MovieVideo, Director, Genre, Actor, Country } = require("../../models");

jest.mock("../../models", () => ({
  Movie: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  MovieVideo: {
    create: jest.fn(),
    destroy: jest.fn(),
  },
  Director: {},
  Genre: {},
  Actor: {},
  Country: {},
}));

describe("MovieController CRUD Operations", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Movie", () => {
    it("should create a new movie successfully", async () => {
      const req = {
        body: {
          title: "Test Movie",
          releaseDate: "2024-01-01",
          country: 1,
          synopsis: "Test synopsis",
          genres: [1, 2],
          actors: [3, 4],
          trailers: ["https://trailer1.com", "https://trailer2.com"],
          poster: "https://posterurl.com",
          directorId: 1,
          rating: 4.5,
        },
        userId: 1,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Movie.create.mockResolvedValue({
        id: 1,
        ...req.body,
        setGenres: jest.fn(), // Mock fungsi setGenres
        setActors: jest.fn(), // Mock fungsi setActors
      });
      MovieVideo.create.mockResolvedValue({});
      Movie.findByPk.mockResolvedValue({ setGenres: jest.fn(), setActors: jest.fn() });

      await MovieController.create(req, res);

      expect(Movie.create).toHaveBeenCalledWith({
        title: req.body.title,
        release_date: req.body.releaseDate,
        countryId: req.body.country,
        synopsis: req.body.synopsis,
        poster_url: req.body.poster,
        directorId: req.body.directorId,
        addedBy: req.userId,
        approval_status: 1,
        rating: req.body.rating,
      });

      expect(MovieVideo.create).toHaveBeenCalledTimes(req.body.trailers.length);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: "success", message: "Movie added successfully" })
      );
    });

    it("should return an error for missing required fields", async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await MovieController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Missing required fields",
        })
      );
    });
  });

  describe("Get All Movies", () => {
    it("should return all movies successfully", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Movie.findAll.mockResolvedValue([{ id: 1, title: "Test Movie" }]);

      await MovieController.getAll(req, res);

      expect(Movie.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([{ id: 1, title: "Test Movie" }])
      );
    });
  });

  describe("Get Movie By ID", () => {
    it("should return a movie successfully", async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Movie.findByPk.mockResolvedValue({ id: 1, title: "Test Movie" });

      await MovieController.getById(req, res);

      expect(Movie.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, title: "Test Movie" });
    });

    it("should return an error if movie is not found", async () => {
      const req = { params: { id: 99 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Movie.findByPk.mockResolvedValue(null);

      await MovieController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Movie not found" })
      );
    });
  });

  describe("Update Movie", () => {
    it("should update a movie successfully", async () => {
      const req = {
        params: { id: 1 },
        body: { title: "Updated Movie Title" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Movie.findByPk.mockResolvedValue({
        update: jest.fn(),
        setGenres: jest.fn(),
        setActors: jest.fn(),
      });

      await MovieController.update(req, res);

      expect(Movie.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: "success", message: "Movie updated successfully" })
      );
    });
  });

  describe("Delete Movie", () => {
    it("should delete a movie successfully", async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Movie.findByPk.mockResolvedValue({
        destroy: jest.fn(),
        setGenres: jest.fn(),
        setActors: jest.fn(),
      });

      await MovieController.delete(req, res);

      expect(Movie.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Movie deleted successfully" })
      );
    });

    it("should return an error if movie is not found", async () => {
      const req = { params: { id: 99 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Movie.findByPk.mockResolvedValue(null);

      await MovieController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Movie not found" })
      );
    });
  });
});
