const Url = require("../models/Url");
const generateCode = require("../utils/generateCode");
const validUrl = require("valid-url");
const { BASE_URL } = require("../config");

exports.shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!validUrl.isUri(originalUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  let shortCode;
  let exists;
  do {
    shortCode = generateCode();
    exists = await Url.findOne({ shortCode });
  } while (exists);

  const newUrl = await Url.create({ originalUrl, shortCode });

  return res.json({ shortUrl: `${BASE_URL}/${shortCode}` });
};

exports.redirectUrl = async (req, res) => {
  const { shortCode } = req.params;
  const url = await Url.findOne({ shortCode });

  if (!url) return res.status(404).send("Short URL not found");

  url.clicks++;
  await url.save();

  return res.redirect(url.originalUrl);
};

exports.getStats = async (req, res) => {
  const { shortCode } = req.params;
  const url = await Url.findOne({ shortCode });

  if (!url) return res.status(404).json({ error: "Short URL not found" });

  res.json({
    originalUrl: url.originalUrl,
    clicks: url.clicks,
    createdAt: url.createdAt,
  });
};
