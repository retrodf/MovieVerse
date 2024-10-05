const Director = require("../models/directorModel");

exports.getAllDirectors = async (req, res) => {
  try {
    const [directors] = await Director.getAllDirectors();
    res.status(200).json(directors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDirectorById = async (req, res) => {
  try {
    const { id } = req.params;
    const [director] = await Director.getDirectorById(id);
    if (director.length === 0) {
      return res.status(404).json({ message: "Director not found" });
    }
    res.status(200).json(director[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDirector = async (req, res) => {
  try {
    const newDirector = req.body;
    await Director.createDirector(newDirector);
    res.status(201).json({ message: "Director created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDirector = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDirector = req.body;
    await Director.updateDirector(id, updatedDirector);
    res.status(200).json({ message: "Director updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDirector = async (req, res) => {
  try {
    const { id } = req.params;
    await Director.deleteDirector(id);
    res.status(200).json({ message: "Director deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
