const express = require("express");
const router = express.Router();
const {
  shortenUrl,
  redirectUrl,
  getStats,
} = require("../controllers/urlController");

router.post("/api/shorten", shortenUrl);
router.get("/api/stats/:shortCode", getStats);
router.get("/:shortCode", redirectUrl);

module.exports = router;
