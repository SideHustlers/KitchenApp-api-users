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
    restrictions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      required: false
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return User;
}