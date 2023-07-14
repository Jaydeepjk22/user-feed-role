const bcrypt = require("bcrypt");
const User = require("../models/user");
const { hasRole } = require("../../auth");
const Role = require("../models/Role");

// Create a new user
async function createUser(req, res) {
  const { name, role, email, password } = req.body;

  try {
    const currentUser = req.user;

    // Check if the current user has Super Admin role
    if (!hasRole(currentUser, "Super Admin")) {
      return res.status(403).json({ message: "Access denied" });
    }

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
      email,
      password: hashedPassword,
    });

    // Assign the role to the user
    const assignedRole = await Role.findOne({ where: { name: role } });
    if (assignedRole) {
      await user.setRole(assignedRole);
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    const currentUser = req.user;

    // Check if the current user has Super Admin or Admin role
    if (
      !hasRole(currentUser, "Super Admin") &&
      !hasRole(currentUser, "Admin")
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

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
    const currentUser = req.user;

    // Check if the current user has Super Admin or Admin role
    if (
      !hasRole(currentUser, "Super Admin") &&
      !hasRole(currentUser, "Admin")
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

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
    const currentUser = req.user;

    // Check if the current user has Super Admin or Admin role
    if (
      !hasRole(currentUser, "Super Admin") &&
      !hasRole(currentUser, "Admin")
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Admin users cannot update other admin users
    if (hasRole(user, "Admin") && !hasRole(currentUser, "Super Admin")) {
      return res.status(403).json({ message: "Access denied" });
    }

    user.name = name;
    user.email = email;

    // Super Admin can update the role of other users
    if (hasRole(currentUser, "Super Admin")) {
      const assignedRole = await Role.findOne({ where: { name: role } });
      if (assignedRole) {
        await user.setRole(assignedRole);
      }
    }

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
    const currentUser = req.user;

    // Check if the current user has Super Admin role
    if (!hasRole(currentUser, "Super Admin")) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Super Admin cannot be deleted
    if (hasRole(user, "Super Admin")) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Admin users cannot delete other admin users
    if (hasRole(user, "Admin") && !hasRole(currentUser, "Super Admin")) {
      return res.status(403).json({ message: "Access denied" });
    }

    await user.destroy();

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
