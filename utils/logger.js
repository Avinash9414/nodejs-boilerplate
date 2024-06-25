const { createLogger, format, transports } = require('winston');        //reusable Logger
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
    // Ensure errors are logged properly
    if (message instanceof Error) {
        return `${timestamp} [${level}]: ${message.stack}`;
    }

    // Handle objects and other messages
    if (typeof message === 'object') {
        message = JSON.stringify(message, null, 2);
    }

    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple()
    }));
}

module.exports = logger;
