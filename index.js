const ExpressLoader = require('./loaders/express-loader');
const logger = require('./utils/logger');

const expressLoader = new ExpressLoader();
const app = expressLoader.getApp();

process.on('SIGINT', () => {
    logger.info('Shutting down server...');
    app.close(() => {
        logger.info('Server has been gracefully terminated.');
        process.exit(0);
    });
});
