'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('password_resets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      reset_id: {
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
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_complete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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
    return queryInterface.dropTable('password_resets');
  }
};
