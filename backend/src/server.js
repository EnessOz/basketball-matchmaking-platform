require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const courtRoutes = require("./routes/courtRoutes");
const matchRoutes = require("./routes/matchRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

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
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});