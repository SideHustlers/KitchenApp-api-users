'use strict'
const strHelpers = require('../helpers/str_helpers');

module.exports = (sequelize, DataTypes) => {
  var Address = sequelize.define('Address', {
    address_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    address_1: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        this.setDataValue('address_1', strHelpers.toTitleCase(val));
      }
    },
    address_2: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
      set(val) {
        this.setDataValue('address_2', strHelpers.toTitleCase(val));
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        this.setDataValue('city', strHelpers.toTitleCase(val));
      }
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
      validate: { len: [2, 2] },
      set(val) {
        this.setDataValue('state', val.toUpperCase());
      }
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // https://stackoverflow.com/a/19844362
        is: /^[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$/i
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'US',
      validate: { len: [2, 2] },
      set(val) {
        this.setDataValue('country', val.toUpperCase());
      }
    },
    latitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      defaultValue: null,
      validate: {min: -90.0, max: 90.0},
      get() {
        return parseFloat(this.getDataValue('latitude'));
      }
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      defaultValue: null,
      validate: {min: -180.0, max: 180.0},
      get() {
        return parseFloat(this.getDataValue('longitude'));
      }
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },   
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Address.associate = function(models) {
    Address.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: 'user_id'
    });
  }
  return Address;
}