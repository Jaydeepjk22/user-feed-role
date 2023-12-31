const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./app/models/user");

// Generate a JWT token
function generateToken(user) {
  const token = jwt.sign({ id: user.id, role: user.role }, "your-secret-key", {
    expiresIn: "12h",
  });
  return token;
}

// Verify a JWT token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, "users-feed-roles");
    return decoded;
  } catch (error) {
    return null;
  }
}

// Check if the user has a specific role
function hasRole(user, roleName) {
  return user?.Role?.name === roleName;
}

// User login
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  verifyToken,
  login,
  hasRole,
};
