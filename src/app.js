const express = require('express');
const morgan = require('morgan');

const logger = require('./lib/logger');
const createError = require('./lib/errors');
const initRabbitmq = require('./lib/rabbitmq');
const initProxy = require('./proxy/index');
const initControllers = require('./controllers');
const initRoutes = require('./routes');

module.exports = (config) => {
  logger.info('App: starting');
  const app = express();
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Dependencies
  const dependencies = {
    // rabbitmq: initRabbitmq(config.rabbitmq),
    // proxy: initProxy(config.proxy),
  };
  // Controllers
  const controllers = initControllers(dependencies);

  // Routes
  initRoutes(app, controllers, config);

  // Error handler
  app.use((req, res, next) => {
    next(createError(`${req.method} - ${req.path} not found`, 404));
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message.message || err.message);
  });
  logger.info('App: started');
  return app;
};
