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

    playerCount: {
        type: Number,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model("Match", matchSchema);