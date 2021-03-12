export default {
  appName: 'Api-Typed Test Fixture App',
  log_level: 'debug',
  typeorm: {
    connection: {
      // match what's in docker-compose.yml
      hostname: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'api_typed',
    },
  },
};
