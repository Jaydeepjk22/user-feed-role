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

// Schedule a task to delete log files older than 30 minutes
setInterval(() => {
  const files = fs.readdirSync(logsDir);

  files.forEach((file) => {
    const filePath = path.join(logsDir, file);
    const fileStat = fs.statSync(filePath);
    const fileAgeMinutes = moment().diff(moment(fileStat.mtime), "minutes");

    if (fileAgeMinutes > 30) {
      fs.removeSync(filePath);
      console.log(`Deleted log file: ${filePath}`);
    }
  });
}, 60000); // Run every minute

module.exports = logger;
