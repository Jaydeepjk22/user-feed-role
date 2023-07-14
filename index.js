const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./auth");
const userRoutes = require("./app/routes/users");
const feedRoutes = require("./app/routes/feeds");
const logger = require("./logger");

const { Role, Feed } = require("./app/models");
const User = require("./app/models/user");
const sequelize = require("./config/database");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(logger);

// Initialize database connection
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/feeds", feedRoutes);

// Create super admin on server startup
async function createSuperAdmin() {
  try {
    await sequelize.transaction(async (transaction) => {
      const [user, created] = await User.findOrCreate({
        where: { role: "Super Admin" },
        defaults: {
          name: "Super Admin",
          email: "admin@example.com",
          password: "adminpassword",
        },
        transaction,
      });

      if (created) {
        console.log("Super admin created");
      } else {
        console.log("Super admin already exists");
      }
    });
  } catch (error) {
    console.error("Error creating super admin:", error);
  }
}

// Start the server
async function startServer() {
  try {
    await initializeDatabase();
    await createSuperAdmin();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

startServer();
