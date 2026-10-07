require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const courtRoutes = require("./routes/courtRoutes");
const matchRoutes = require("./routes/matchRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const {
  processRequiredLocationPenalties,
} = require("./services/matchPenaltyService");

const app = express();

connectDB();

const PORT = 5000;

const REQUIRED_LOCATION_PENALTY_CHECK_INTERVAL_MS =
  60 * 1000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CourtMatch Backend Running");
});

app.use("/courts", courtRoutes);
app.use("/matches", matchRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/notifications", notificationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Server açıldığında bir kez hemen kontrol et.
  processRequiredLocationPenalties();

  // Sonrasında her 60 saniyede bir
  // süresi bitmiş zorunlu lokasyonlu
  // maçları kontrol et.
  setInterval(
    processRequiredLocationPenalties,
    REQUIRED_LOCATION_PENALTY_CHECK_INTERVAL_MS
  );
});