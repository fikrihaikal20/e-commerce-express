'use strict';
const debug = require('../services/debug')
debug.logHeader("loading models")

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../../config/database.js'))[env];
debug.logData('chosen env', env);
debug.logData('chosen config', config);

const db = {};

let sequelize;
if (config.use_env_variable) {
  debug.logData("using env_variable", config.use_env_variable)
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  debug.logData("using config", config)
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.testDBConnection = async function () {
  try {
    sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
    return;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return Promise.reject(error);
  }
}

//db.testDBConnection();

module.exports = db;
