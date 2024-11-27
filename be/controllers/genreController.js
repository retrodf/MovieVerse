// controllers/genreController.js
const Genre = require("../models/Genre");

// Function to get all genres
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll();
    res.status(200).json(genres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching genres", error: err });
  }
};

// Function to create a new genre
exports.createGenre = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const genre = await Genre.create({ name });
    res.status(201).json({ message: "Genre created successfully", genre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating genre", error: err });
  }
};

// Function to get a genre by ID
exports.getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }
    res.status(200).json(genre);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching genre", error: err });
  }
};

// Function to update a genre
exports.updateGenre = async (req, res) => {
  const { name } = req.body;

  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    genre.name = name || genre.name;
    await genre.save();

    res.status(200).json({ message: "Genre updated successfully", genre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating genre", error: err });
  }
};

// Function to delete a genre
exports.deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    await genre.destroy();
    res.status(200).json({ message: "Genre deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting genre", error: err });
  }
};
