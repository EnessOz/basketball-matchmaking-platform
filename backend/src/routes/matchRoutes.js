const express = require("express");

const router = express.Router();

const {
  getAllMatches,
  createMatch,
  joinMatch,
} = require("../controllers/matchController");

router.get("/", getAllMatches);

router.post("/", createMatch);

router.patch("/:id/join", joinMatch);

module.exports = router;