'use strict'

module.exports = (sequelize, DataTypes) => {
  var Contact = sequelize.define('Contact', {
    contact_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        // strip all non-numerical (\D) characters
        this.setDataValue('phone_number', val.replace(/\D/g, ''));
      }
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Contact.associate = function(models) {
    Contact.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: 'user_id'
    });
  }
  return Contact;
}