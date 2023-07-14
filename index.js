const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./logger");
const sequelize = require("./config/database");
const User = require("./app/models/user");
const { Role, Feed } = require("./models");

const authRoutes = require("./auth");
const userController = require("./app/controllers/userController");
const feedController = require("./app/controllers/feedController");

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

// Routes
app.use("/auth", authRoutes);
app.get("/users", userController.getAllUsers);
app.get("/users/:id", userController.getUserById);
app.post("/users", userController.createUser);
app.put("/users/:id", userController.updateUserById);
app.delete("/users/:id", userController.deleteUserById);

app.get("/feeds", feedController.getAllFeeds);
app.get("/feeds/:id", feedController.getFeedById);
app.post("/feeds", feedController.createFeed);
app.put("/feeds/:id", feedController.updateFeedById);
app.delete("/feeds/:id", feedController.deleteFeedById);

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
