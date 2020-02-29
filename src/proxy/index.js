const proxy = require('express-http-proxy');
const logger = require('../lib/logger');

module.exports = (config) => {
  logger.info('Proxy: starting');
  const proxies = Object.keys(config).reduce((total, key) => {
    const prop = config[key];
    // eslint-disable-next-line no-param-reassign
    total[key] = proxy();
    logger.info(`   ${key} at ${prop.domain}:${prop.port}`);
    return total;
  }, {});

  logger.info('Proxy: started');
  return proxies;
};
