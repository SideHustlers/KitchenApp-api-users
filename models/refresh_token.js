'use strict'


module.exports = (sequelize, DataTypes) => {
  var RefreshToken = sequelize.define('RefreshToken', {
    token_id: {
      type: DataTypes.UUID,
      allowNull:false
    },
    client_uuid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  RefreshToken.associate = function(models) {
    RefreshToken.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: 'user_id',
      targetKey: 'user_id',
      as: 'user'
    });
    RefreshToken.belongsTo(models.Client, {
      onDelete: "CASCADE",
      foreignKey: 'client_uuid',
      targetKey: 'client_uuid',
      as: 'client'
    });
  }

  return RefreshToken;
}