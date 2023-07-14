const jwt = require("jsonwebtoken");

// Generate a JWT token
function generateToken(user) {
  const token = jwt.sign({ id: user.id, role: user.role }, "your-secret-key", {
    expiresIn: "1h",
  });
  return token;
}

// Verify a JWT token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, "your-secret-key");
    return decoded;
  } catch (error) {
    return null;
  }
}
