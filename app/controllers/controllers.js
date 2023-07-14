const Feed = require("../models/feed");
const User = require("../models/user");

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get a user by ID
async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Update a user by ID
async function updateUserById(req, res) {
  const { id } = req.params;
  const { name, role, email } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.role = role;
    user.email = email;
    await user.save();

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Delete a user by ID
async function deleteUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get all feeds
async function getAllFeeds(req, res) {
  try {
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
}

// Delete a feed by ID
async function deleteFeedById(req, res) {
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
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getAllFeeds,
  getFeedById,
  updateFeedById,
  deleteFeedById,
};
