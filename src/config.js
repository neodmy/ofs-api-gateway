module.exports = {
  server: {
    port: Number(process.env.SERVER_PORT) || 5000,
  },
  rabbit: {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: process.env.RABBITMQ_PORT || 5672,
  },
  endpoints: {
    login: '/login',
    signup: '/signup',
    images: '/images',
    users: '/users',
  },
  proxies: {
    users: {
      domain: 'localhost',
      port: 5001,
    },
    images: {
      domain: 'localhost',
      port: 5003,
    },
  },
};
