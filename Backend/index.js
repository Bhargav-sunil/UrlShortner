const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const urlRoutes = require("./routes/urlRoutes");
const { PORT } = require("./config");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", urlRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
