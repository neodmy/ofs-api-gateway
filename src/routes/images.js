const { Router } = require('express');

const logger = require('../lib/logger');

const router = Router();

module.exports = ({ imagesController }) => {
  router.get('/status', async (req, res, next) => {
    try {
      const status = await imagesController.getDevicesStatus();
      res.send(status);
    } catch (error) {
      next(error);
    }
  });

  router.get('/**', async (req, res, next) => {
    try {
      const device = req.url;
      const response = await imagesController.getDeviceImage(device);
      res.send(response);
    } catch (error) {
      next(error);
    }
  });

  logger.info('   Images routes');
  return router;
};
