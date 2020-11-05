'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var config    = require('../config/' + process.env.NODE_ENV + '.js');
var db        = {};

const usersDbConfig = config;


var sequelize = new Sequelize(
    usersDbConfig.database, 
    usersDbConfig.username, 
    usersDbConfig.password, {
      host: usersDbConfig.host,
      dialect: usersDbConfig.dialect,
    }
  );

// discover and load models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// why is this a thing! it just is
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
