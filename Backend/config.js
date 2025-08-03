require("dotenv").config();

module.exports = {
  BASE_URL: process.env.BASE_URL || "http://localhost:5000",
  PORT: process.env.PORT || 5000,
};
