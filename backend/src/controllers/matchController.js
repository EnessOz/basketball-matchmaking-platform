const Match = require("../models/Match");

const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: "Maçlar alınamadı",
    });
  }
};

const createMatch = async (req, res) => {
  try {
    const newMatch = await Match.create({
      ...req.body,
      createdBy: req.userId,
    });

    res.status(201).json(newMatch);
  } catch (error) {
    res.status(400).json({
      message: "Maç oluşturulamadı",
    });
  }
};

const joinMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        message: "Maç bulunamadı",
      });
    }

    match.playerCount += 1;

    await match.save();

    res.json(match);
  } catch (error) {
    res.status(500).json({
      message: "Maça katılınamadı",
    });
  }
};

module.exports = {
  getAllMatches,
  createMatch,
  joinMatch,
};