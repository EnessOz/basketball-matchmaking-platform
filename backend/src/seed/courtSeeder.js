require("dotenv").config();

const mongoose = require("mongoose");
const Court = require("../models/Court");
const courts = require("../data/courts");

const seedCourts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Court.insertMany(courts);

    console.log("Courts added to MongoDB");

    process.exit();
  } catch (error) {
    console.error("Court seeding error:", error);

    process.exit(1);
  }
};

seedCourts();