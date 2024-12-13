const { Sequelize } = require('sequelize');
const dbConfig = require('../config/config.js');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false
  }
);

const models = {
  Exercise: require('./Exercise')(sequelize),
  Progress: require('./Progress')(sequelize),
  User: require('./User')(sequelize),
  Routine: require('./Routine')(sequelize),
  Training: require('./Training')(sequelize),
  Set: require('./Set')(sequelize),
  RepMax: require('./RepMax')(sequelize),
  Session: require('./Session')(sequelize)
};

// Establecer asociaciones
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, ...models };