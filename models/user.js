'use strict'

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    restrictions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      required: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  User.associate = function(models) {
    User.hasMany(models.Contact, { foreignKey: 'user_id', sourceKey: 'user_id'});
    User.hasMany(models.Address, { foreignKey: 'user_id', sourceKey: 'user_id'});
  }

  return User;
}