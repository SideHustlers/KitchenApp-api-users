'use strict'

module.exports = (sequelize, DataTypes) => {
  var PasswordReset = sequelize.define('PasswordReset', {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    reset_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_complete: {
      type:  DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  PasswordReset.associate = function(models) {
    PasswordReset.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: 'user_id'
    });
  }

  return PasswordReset;
}