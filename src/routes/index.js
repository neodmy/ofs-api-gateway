const proxy = require('express-http-proxy');

const logger = require('../lib/logger');
const createError = require('../lib/errors');
const { generateToken, verifyMiddleware } = require('../lib/checkAuth');

module.exports = (app, controllers, { endpoints, proxies }) => {
  logger.info('Routes: starting');
  const proxyAddress = ({ domain, port }) => `${domain}:${port}`;
  const changeReqProps = (proxyResData, ...params) => {
    const data = JSON.parse(proxyResData.toString());
    const options = {
      password: () => { if (data.password) delete data.password; },
      token: () => { data.token = generateToken(data); },
    };
    params.forEach((param) => {
      const func = options[param];
      if (func) func();
    });
    return data;
  };
  const errorHandler = () => createError('Service unavailable', 502);

  app.use(endpoints.images, proxy(proxyAddress(proxies.images), {
    proxyReqPathResolver: (req) => `${req.originalUrl}`,
    proxyErrorHandler: (err, res, next) => next(createError('Couldn\'t reach Images service', 502)),
  }));

  app.use(endpoints.login, proxy(proxyAddress(proxies.users), {
    proxyReqPathResolver: (req) => endpoints.login,
    proxyErrorHandler: (err, res, next) => next(errorHandler()),
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => changeReqProps(proxyResData, 'password', 'token'),

  }));

  app.use(endpoints.signup, proxy(proxyAddress(proxies.users), {
    proxyReqPathResolver: (req) => endpoints.signup,
    proxyErrorHandler: (err, res, next) => next(errorHandler()),
  }));

  app.use(`${endpoints.users}/:id`, verifyMiddleware, proxy(proxyAddress(proxies.users), {
    proxyReqPathResolver: (req) => `${req.originalUrl}`,
    proxyErrorHandler: (err, res, next) => next(errorHandler()),
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => changeReqProps(proxyResData, 'password'),
  }));

  app.use(endpoints.users, proxy(proxyAddress(proxies.users), {
    proxyReqPathResolver: (req) => `${req.originalUrl}`,
    proxyErrorHandler: (err, res, next) => next(errorHandler()),
  }));

  logger.info('Routes: started');
};
