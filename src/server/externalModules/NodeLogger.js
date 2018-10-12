const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const util = require('util');
const winston = require('winston');
require('winston-daily-rotate-file');

const prodEnv = process.env.NODE_ENV === 'production';

exports.createLogger = function ({
  logPath,
}) {
  (function logPathShouldBePresent() {
    if (!fs.existsSync(logPath)){
      fs.mkdirSync(logPath);
    }
  })();
  
  const consoleLogger = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.splat(),
      tagAndColor,
    ),
    level: 'debug',
  });
  
  const dailyRotateFileLogger = new winston.transports.DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    dirname: logPath,
    filename: 'app-%DATE%.log',
    format: winston.format.combine(
      ignoreConsoleOnly(),
      winston.format.timestamp(),
      winston.format.json(),
    ),
    level: 'error',
    prepend: false,
  });
  
  const winstonLogger = winston.createLogger({
    transports: [
      consoleLogger,
      dailyRotateFileLogger,
    ],
  });

  const enhancedLogger = withWith(winstonLogger);
  testLog(enhancedLogger);
  return enhancedLogger;
};

const tagAndColor = winston.format.printf(({
  color,
  level,
  message,
  tag,
  timestamp,
}) => {
  const fallback = `${timestamp} ${level}: ${message}`;
  if (tag) {
    try {
      const tagLabel = color && chalk[color] ? `[${chalk[color](tag)}]` : tagLabel;
      return `${timestamp} ${level}: ${tagLabel} ${util.format(...message)}`;
    } catch (err) {
      console.error('[NodeLogger] Something wrong in tagAndColor', err);
      return fallback;
    }
  } else {
    return fallback;
  }
});

const ignoreConsoleOnly = winston.format((info, opts) => {
  return info.consoleOnly ? false : info;
});

function withWith(logger) {
  if (logger.with !== undefined) {
    console.warn('winston.with is overwritten by custom with(). Contact the author to either rename the props or remove it.' );
  }

  Object.defineProperty(logger, 'with', {
    enumerable: true,
    value: function ({
      color,
      tag = 'tag-undefined',
    }) {
      const that = this;
      const obj = {};
      
      Object.keys(that.levels)
        .forEach((level) => {
          obj[level] = function (...message) {
            that[level]({
              color,
              message,
              tag,
            });
          };
        });
      return obj;
    },
  });
  return logger;
}

function testLog(logger) {
  logger.debug('---------------------- NodeLogger - test log ----------------------');
  Object.keys(logger.levels)
    .forEach((level) => {
      logger[level]({
        consoleOnly: true,
        message: `NodeLogger - testLog level: ${level}`,
      });
    });
  logger.debug('---------------------- NodeLogger - test log ----------------------');
}
