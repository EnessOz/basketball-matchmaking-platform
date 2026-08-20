const Court = require("../models/Court");

const getAllCourts = async (req, res) => {
  try {
    const courts = await Court.find();

    res.json(courts);
  } catch (error) {
    res.status(500).json({
      message: "Sahalar alınamadı",
    });
  }
};

module.exports = {
  getAllCourts,
};