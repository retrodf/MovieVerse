const Actor = require("../models/actorModel");

exports.getAllActors = async (req, res) => {
  try {
    const [actors] = await Actor.getAllActors();
    console.log("Actors Data:", actors); // Debug untuk melihat data yang akan dikirim
    res.status(200).json(actors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getActorById = async (req, res) => {
  try {
    const { id } = req.params;
    const actor = await Actor.getActorById(id);
    if (actor.length === 0) {
      return res.status(404).json({ message: "Actor not found" });
    }
    res.status(200).json(actor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createActor = async (req, res) => {
  try {
    const newActor = req.body;
    await Actor.createActor(newActor);
    res.status(201).json({ message: "Actor created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateActor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedActor = req.body;
    await Actor.updateActor(id, updatedActor);
    res.status(200).json({ message: "Actor updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteActor = async (req, res) => {
  try {
    const { id } = req.params;
    await Actor.deleteActor(id);
    res.status(200).json({ message: "Actor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
