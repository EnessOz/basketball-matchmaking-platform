const express = require("express");

const router = express.Router();

const {
  getAllMatches,
  getMyMatches,
  getJoinedMatches,
  createMatch,
  joinMatch,
  leaveMatch,
  deleteMatch,
} = require("../controllers/matchController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getAllMatches);

router.get("/my", authMiddleware, getMyMatches);

router.get("/joined", authMiddleware, getJoinedMatches);

router.post("/", authMiddleware, createMatch);

router.patch("/:id/join", authMiddleware, joinMatch);

router.patch("/:id/leave", authMiddleware, leaveMatch);

router.delete("/:id", authMiddleware, deleteMatch);

module.exports = router;