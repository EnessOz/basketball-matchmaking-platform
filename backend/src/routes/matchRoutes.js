const express = require("express");
const router = express.Router();

const {
  getAllMatches,
  createMatch,
} = require("../controllers/matchController");

router.get("/", getAllMatches);

router.post("/", createMatch);

module.exports = router;