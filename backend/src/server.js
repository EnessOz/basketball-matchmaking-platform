const matches = require("./data/matches");
const courts = require("./data/courts");
const express = require("express");

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("CourtMatch Backend Running");
});
app.get("/courts", (req, res) => {
    res.json(courts);
});
app.get("/matches", (req, res) => {
    res.json(matches);
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});