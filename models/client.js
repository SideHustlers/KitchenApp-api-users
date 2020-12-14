'use strict'
const { v4: uuid } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  var Client = sequelize.define('Client', {
    client_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: uuid()
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    client_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    client_secret: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Client;
}