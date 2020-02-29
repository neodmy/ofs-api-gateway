const logger = require('../lib/logger');
const initImagesController = require('./images');

module.exports = ({ proxy }) => {
  logger.info('Controllers: starting');
  const imagesController = initImagesController(proxy);
  logger.info('Controllers: started');
  return {
    imagesController,
  };
};
