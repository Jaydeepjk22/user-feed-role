const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Feed = require("../models/feed");
const { verifyToken } = require("../../auth");
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/controllers");

const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
  const { name, role, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      name,
      role,
      email,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new feed
router.post("/:userId/feeds", async (req, res) => {
  const { userId } = req.params;
  const { name, url, description } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const feed = await Feed.create({
      name,
      url,
      description,
    });

    await user.addFeed(feed);

    return res.json(feed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all users
router.get("/", verifyToken, getAllUsers);

// Get a user by ID
router.get("/:id", verifyToken, getUserById);

// Update a user by ID
router.put("/:id", verifyToken, updateUserById);

// Delete a user by ID
router.delete("/:id", verifyToken, deleteUserById);

// Get logs for the last 5 minutes
router.get("/logs", (req, res) => {
  const logFile = path.join(logsDir, "access.log");
  const currentTime = moment();
  const fiveMinutesAgo = moment().subtract(5, "minutes");

  fs.readFile(logFile, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    const lines = data.split("\n");
    const logs = lines.filter((line) => {
      const logTime = moment(line.split(" ")[0], "YYYY-MM-DDTHH:mm:ss.SSSZ");
      return logTime.isBetween(fiveMinutesAgo, currentTime);
    });

    return res.json({ logs });
  });
});

module.exports = router;
