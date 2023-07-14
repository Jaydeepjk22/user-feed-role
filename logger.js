const fs = require("fs-extra");
const path = require("path");
const morgan = require("morgan");
const moment = require("moment");

const logsDir = path.join(__dirname, "logs");

// Create the logs directory if it doesn't exist
fs.ensureDirSync(logsDir);

// Create a write stream for the logs
const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
  flags: "a",
});

// Logging middleware using Morgan
const logger = morgan("combined", { stream: accessLogStream });

module.exports = logger;
