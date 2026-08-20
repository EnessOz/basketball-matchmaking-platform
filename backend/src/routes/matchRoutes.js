const express = require("express");

const router = express.Router();

const {
  getAllMatches,
  createMatch,
  joinMatch,
} = require("../controllers/matchController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getAllMatches);

router.post("/", authMiddleware, createMatch);

router.patch("/:id/join", joinMatch);

module.exports = router;