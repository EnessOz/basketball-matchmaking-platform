const express = require("express");

const router = express.Router();

const {
  getAllMatches,
  getMyMatches,
  createMatch,
  joinMatch,
  deleteMatch,
} = require("../controllers/matchController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getAllMatches);

router.get("/my", authMiddleware, getMyMatches);

router.post("/", authMiddleware, createMatch);

router.patch("/:id/join", joinMatch);

router.delete("/:id", authMiddleware, deleteMatch);

module.exports = router;