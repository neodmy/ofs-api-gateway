const http = require('http');

const logger = require('./lib/logger');
const config = require('./config');
const initApp = require('./app');

const init = async () => {
  logger.info('Server: starting');
  try {
    const { server: { port } } = config;
    const app = initApp(config);
    app.set('port', port);
    const server = http.createServer(app);
    await server.listen(port);
    logger.info(`Server: listening on port ${port}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

init();
