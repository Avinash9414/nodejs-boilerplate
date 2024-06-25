const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const logger = require('../utils/logger');
const config = require('../config/config');

class ExpressLoader {
    constructor() {
        this.app = express();
        this.port = config.port;

        this.setupMiddleware();
        this.setupViewEngine();
        this.setupRoutes();
        this.startServer();
    }

    setupMiddleware() {
        // Implement middleware setup
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(session({
            secret: config.sessionSecret,
            resave: false,
            saveUninitialized: false
        }));
        this.app.use(express.static(path.join(__dirname, '..', 'public')));
    }

    setupViewEngine() {
        // Implement view engine setup
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, '..', 'views'));
    }

    setupRoutes() {
        // Implement route setup
        // Example:
        // const authRoutes = require('../routes/auth');
        // this.app.use('/', authRoutes);
    }

    startServer() {
        // Implement server start
        this.server = this.app.listen(this.port, () => {
            logger.info(`Server is running on http://localhost:${this.port}`);
        });
    }

    getApp() {
        return this.app;
    }

    get Server() {
        return this.server;
    }
}

module.exports = ExpressLoader;
