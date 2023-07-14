const express = require("express");
const { verifyToken } = require("../../auth");
const feedController = require("../controllers/feedController");

const router = express.Router();

// Create a new feed
router.post("/", verifyToken, feedController.createFeed);

// Get all feeds
router.get("/", verifyToken, feedController.getAllFeeds);

// Get a feed by ID
router.get("/:id", verifyToken, feedController.getFeedById);

// Update a feed by ID
router.put("/:id", verifyToken, feedController.updateFeedById);

// Delete a feed by ID
router.delete("/:id", verifyToken, feedController.deleteFeedById);

module.exports = router;
