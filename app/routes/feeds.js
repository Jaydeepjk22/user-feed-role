const express = require("express");
const { verifyToken } = require("../auth");
const Feed = require("../models/feed");

const router = express.Router();

// Get all feeds
router.get("/", async (req, res) => {
  try {
    const feeds = await Feed.findAll();
    return res.json(feeds);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update a feed
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, url, description } = req.body;

  try {
    const feed = await Feed.findByPk(id);

    if (!feed) {
      return res.status(404).json({ message: "Feed not found" });
    }

    feed.name = name;
    feed.url = url;
    feed.description = description;
    await feed.save();

    return res.json(feed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a feed
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const feed = await Feed.findByPk(id);

    if (!feed) {
      return res.status(404).json({ message: "Feed not found" });
    }

    await feed.destroy();

    return res.json({ message: "Feed deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
