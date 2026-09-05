'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('ProjectMembers', 'role', {
      type: Sequelize.ENUM('owner', 'lead', 'member'),
      allowNull: false,
      defaultValue: 'member',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('ProjectMembers', 'role', {
      type: Sequelize.ENUM('owner', 'member'),
      allowNull: false,
      defaultValue: 'member',
    });
  },
};
