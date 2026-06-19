require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const courtRoutes = require("./routes/courtRoutes");
const matchRoutes = require("./routes/matchRoutes");

const app = express();

connectDB();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CourtMatch Backend Running");
});

app.use("/courts", courtRoutes);
app.use("/matches", matchRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});