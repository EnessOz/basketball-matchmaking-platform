const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },

    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: true,
    },

    type: {
      type: String,
      enum: ["favorite_court_match"],
      default: "favorite_court_match",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index(
  {
    recipient: 1,
    match: 1,
    type: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);