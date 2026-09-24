const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  favoriteCourts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
    },
  ],

  notificationsMutedUntil: {
    type: Date,
    default: null,
  },

  matchCreationHistory: [
    {
      type: Date,
    },
  ],

  rankPoints: {
    type: Number,
    default: 1000,
    min: 0,
  },
});

module.exports = mongoose.model("User", userSchema);