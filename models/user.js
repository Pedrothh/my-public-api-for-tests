'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Associações aqui, se necessário
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      inativo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3, // 1 = Admin, 2 = Moderador, 3 = Usuário comum
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users', // Aqui você pode especificar explicitamente o nome da tabela
      timestamps: true, // Isso adiciona automaticamente createdAt e updatedAt
    }
  );

  return User;
};
