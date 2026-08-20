const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  district: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },

  images: {
    type: [String],
    default: [],
  },

  features: {
    lighting: {
      type: Boolean,
      default: false,
    },
    indoor: {
      type: Boolean,
      default: false,
    },
    rim_count: {
      type: Number,
      required: true,
    },
  },

  tags: {
    type: [String],
    default: [],
  },

  rating: {
    type: Number,
    default: 0,
  },

  createdBy: {
    type: String,
    default: "admin",
  },
});
module.exports = mongoose.model("Court", courtSchema);