const Feed = require("../models/feed");
const { hasRole } = require("../../auth");
const sequelize = require("../../config/database");

// Create a new feed
async function createFeed(req, res) {
  const { name, url, description } = req.body;

  try {
    const currentUser = req.user;

    // Check if the current user has Super Admin role
    if (!hasRole(currentUser, "Super Admin")) {
      return res.status(403).json({ message: "Access denied" });
    }

    await sequelize.transaction(async (transaction) => {
      const feed = await Feed.create(
        {
          name,
          url,
          description,
        },
        { transaction }
      );

      return res.json(feed);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get all feeds
async function getAllFeeds(req, res) {
  try {
    const currentUser = req.user;

    // Check if the current user has Super Admin or Admin role
    if (
      !hasRole(currentUser, "Super Admin") &&
      !hasRole(currentUser, "Admin")
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const feeds = await Feed.findAll();
    return res.json(feeds);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get a feed by ID
async function getFeedById(req, res) {
  const { id } = req.params;

  try {
    const currentUser = req.user;

    // Check if the current user has Super Admin or Admin role
    if (
      !hasRole(currentUser, "Super Admin") &&
      !hasRole(currentUser, "Admin")
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const feed = await Feed.findByPk(id);

    if (!feed) {
      return res.status(404).json({ message: "Feed not found" });
    }

    return res.json(feed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Update a feed by ID
async function updateFeedById(req, res) {
  const { id } = req.params;
  const { name, url, description } = req.body;

  try {
    const currentUser = req.user;

    // Check if the current user has Super Admin or Admin role
    if (
      !hasRole(currentUser, "Super Admin") &&
      !hasRole(currentUser, "Admin")
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await sequelize.transaction(async (transaction) => {
      const feed = await Feed.findByPk(id, { transaction });

      if (!feed) {
        return res.status(404).json({ message: "Feed not found" });
      }

      feed.name = name;
      feed.url = url;
      feed.description = description;
      await feed.save({ transaction });

      return res.json(feed);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Delete a feed by ID
async function deleteFeedById(req, res) {
  const { id } = req.params;

  try {
    const currentUser = req.user;

    // Check if the current user has Super Admin or Admin role
    if (
      !hasRole(currentUser, "Super Admin") &&
      !hasRole(currentUser, "Admin")
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await sequelize.transaction(async (transaction) => {
      const feed = await Feed.findByPk(id, { transaction });

      if (!feed) {
        return res.status(404).json({ message: "Feed not found" });
      }

      await feed.destroy({ transaction });

      return res.json({ message: "Feed deleted successfully" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createFeed,
  getAllFeeds,
  getFeedById,
  updateFeedById,
  deleteFeedById,
};
