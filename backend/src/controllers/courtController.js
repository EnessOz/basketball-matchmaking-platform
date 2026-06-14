const courts = require("../data/courts");

const getAllCourts = (req, res) => {
  res.json(courts);
};

module.exports = {
  getAllCourts,
};