'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      contact_id: {
        type: Sequelize.UUID,
        allowNull: false,
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
      phone_number: {
        allowNull: false,
        type: Sequelize.STRING
      },
      label: {
        type: Sequelize.STRING,
        allowNull:true,
      },
      is_default: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('contacts');
  }
};
