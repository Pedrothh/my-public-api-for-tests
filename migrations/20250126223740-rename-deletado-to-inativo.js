'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'inativo', 'inativo');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'inativo', 'inativo');
  }
};
