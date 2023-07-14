const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("user_feed", "root", "1998", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
