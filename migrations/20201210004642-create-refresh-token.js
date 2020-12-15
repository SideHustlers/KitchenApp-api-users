'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('refresh_tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      token_id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: uuid(),
        primaryKey: true
      },
      client_uuid: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: 'clients',
          key: 'client_uuid'
        }
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
      token: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expires_at: {
        type: Sequelize.DATE,
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
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('refresh_tokens');
  }
};
