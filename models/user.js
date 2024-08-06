'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.RoleUserCustomer, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      });
    }
  }
  User.init({
    firstName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    phoneNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: true },
    profilePicture: { type: DataTypes.STRING, allowNull: true },
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    }, scopes: {
      withPassword: {
        attributes: {},
      },
    },
  });
  return User;
};