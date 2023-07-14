const express = require("express");
const Feed = require("../models/feed");
const { verifyToken } = require("../../auth");
const {
  getAllFeeds,
  getFeedById,
  updateFeedById,
  deleteFeedById,
} = require("../controllers/controllers");

const router = express.Router();

// Get all feeds
router.get("/", verifyToken, getAllFeeds);

// Get a feed by ID
router.get("/:id", verifyToken, getFeedById);

// Update a feed by ID
router.put("/:id", verifyToken, updateFeedById);

// Delete a feed by ID
router.delete("/:id", verifyToken, deleteFeedById);

module.exports = router;
