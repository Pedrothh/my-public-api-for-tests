'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adiciona a coluna 'deletado'
    await queryInterface.addColumn('users', 'deletado', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // Adiciona a coluna 'createdAt'
    await queryInterface.addColumn('users', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    // Adiciona a coluna 'updatedAt'
    await queryInterface.addColumn('users', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },
  async down(queryInterface, Sequelize) {
    // Remove as colunas adicionadas
    await queryInterface.removeColumn('users', 'deletado');
    await queryInterface.removeColumn('users', 'createdAt');
    await queryInterface.removeColumn('users', 'updatedAt');
  },
};
