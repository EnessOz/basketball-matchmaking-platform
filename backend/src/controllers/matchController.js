const matches = require("../data/matches");

const getAllMatches = (req, res) => {
  res.json(matches);
};

const createMatch = (req, res) => {
  const newMatch = {
    id: matches.length + 1,
    ...req.body,
  };

  matches.push(newMatch);

  res.status(201).json(newMatch);
};

module.exports = {
  getAllMatches,
  createMatch,
};