const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  courtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Court",
    required: true,
  },

  courtName: {
    type: String,
    required: true,
  },

  district: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  locationVerifications: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      verifiedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],

  locationRequired: {
    type: Boolean,
    default: false,
  },

  requiredLocationPenaltyApplied: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Match", matchSchema);