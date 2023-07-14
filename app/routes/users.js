const express = require("express");
const { verifyToken } = require("../../auth");
const userController = require("../controllers/userController");

const router = express.Router();

// Create a new user
router.post("/", verifyToken, userController.createUser);

// Get all users
router.get("/", verifyToken, userController.getAllUsers);

// Get a user by ID
router.get("/:id", verifyToken, userController.getUserById);

// Update a user by ID
router.put("/:id", verifyToken, userController.updateUserById);

// Delete a user by ID
router.delete("/:id", verifyToken, userController.deleteUserById);

module.exports = router;
