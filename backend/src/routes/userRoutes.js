const express = require("express");
const router = express.Router();

const {
  getFavoriteCourts,
  addFavoriteCourt,
  removeFavoriteCourt,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/favorites", authMiddleware, getFavoriteCourts);

router.patch(
  "/favorites/:courtId",
  authMiddleware,
  addFavoriteCourt
);

router.delete(
  "/favorites/:courtId",
  authMiddleware,
  removeFavoriteCourt
);

module.exports = router;