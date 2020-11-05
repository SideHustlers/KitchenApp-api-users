'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER 
      },
      address_id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: uuid(),
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      label: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: "",
      },
      address_1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      address_2: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: ""
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING(2)
      },
      zip: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      latitude: {
        allowNull: true,
        type: Sequelize.DECIMAL(11, 8),
      },
      longitude: {
        allowNull: true,
        type: Sequelize.DECIMAL(11, 8),
      },
      is_default: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('addresses');
  }
};
