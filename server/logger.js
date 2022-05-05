const winston = require("winston");
const path = require("path");
const fs = require("fs");
require("winston-daily-rotate-file");

const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const logPath = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}

const logger = winston.createLogger({
  level,
  format: winston.format.json(),
  //efaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.DailyRotateFile({
      filename: "../logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logPath, "combined.log"),
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
