const createError = require('../lib/errors');
const logger = require('../lib/logger');

module.exports = (proxy) => {
  const getDevicesStatus = async () => {
    try {
      const res = await proxy.images.get('images/status').then((response) => response.data);
      return res;
    } catch (error) {
      throw createError('Could not reach Images servce', 502);
    }
  };

  const getDeviceImage = async (device) => {
    try {
      const res = await proxy.images.get(`images${device}`).then((response) => response);
      console.log(res);
      return res;
    } catch (error) {
      throw createError('Could not reach Images servce', 502);
    }
  };
  logger.info('   Images Controller');
  return {
    getDevicesStatus,
    getDeviceImage,
  };
};
