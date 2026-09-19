const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  getNotificationSettings,
  acceptNotification,
  rejectNotification,
  muteNotifications,
  unmuteNotifications,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getMyNotifications);

router.get(
  "/settings",
  authMiddleware,
  getNotificationSettings
);

router.patch(
  "/mute",
  authMiddleware,
  muteNotifications
);

router.patch(
  "/unmute",
  authMiddleware,
  unmuteNotifications
);

router.patch(
  "/:id/accept",
  authMiddleware,
  acceptNotification
);

router.patch(
  "/:id/reject",
  authMiddleware,
  rejectNotification
);

module.exports = router;