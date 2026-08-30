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

const getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      createdBy: req.userId,
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: "Maçların alınamadı",
    });
  }
};

const getJoinedMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      participants: req.userId,
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: "Katıldığın maçlar alınamadı",
    });
  }
};

const createMatch = async (req, res) => {
  try {
    const newMatch = await Match.create({
      ...req.body,
      createdBy: req.userId,
      participants: [req.userId],
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

    if (match.createdBy.toString() === req.userId) {
      return res.status(400).json({
        message: "Bu maçın sahibi sensin",
      });
    }

    const alreadyJoined = match.participants.some(
      (participantId) => participantId.toString() === req.userId
    );

    if (alreadyJoined) {
      return res.status(400).json({
        message: "Bu maça zaten katıldın",
      });
    }

    match.participants.push(req.userId);

    await match.save();

    res.json(match);
  } catch (error) {
    res.status(500).json({
      message: "Maça katılınamadı",
    });
  }
};

const leaveMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        message: "Maç bulunamadı",
      });
    }

    if (match.createdBy.toString() === req.userId) {
      return res.status(400).json({
        message: "Kendi oluşturduğun maçtan ayrılamazsın",
      });
    }

    const participantIndex = match.participants.findIndex(
      (participantId) => participantId.toString() === req.userId
    );

    if (participantIndex === -1) {
      return res.status(400).json({
        message: "Bu maça zaten katılmıyorsun",
      });
    }

    match.participants.splice(participantIndex, 1);

    await match.save();

    res.json(match);
  } catch (error) {
    res.status(500).json({
      message: "Maçtan ayrılınamadı",
    });
  }
};

const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        message: "Maç bulunamadı",
      });
    }

    if (match.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        message: "Bu maçı silme yetkin yok",
      });
    }

    await match.deleteOne();

    res.json({
      message: "Maç başarıyla silindi",
    });
  } catch (error) {
    res.status(500).json({
      message: "Maç silinemedi",
    });
  }
};

module.exports = {
  getAllMatches,
  getMyMatches,
  getJoinedMatches,
  createMatch,
  joinMatch,
  leaveMatch,
  deleteMatch,
};