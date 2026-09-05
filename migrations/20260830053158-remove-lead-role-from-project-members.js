'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE ProjectMembers
      SET role = 'member'
      WHERE role = 'lead'
    `);

    await queryInterface.changeColumn('ProjectMembers', 'role', {
      type: Sequelize.ENUM('owner', 'member'),
      allowNull: false,
      defaultValue: 'member',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('ProjectMembers', 'role', {
      type: Sequelize.ENUM('owner', 'lead', 'member'),
      allowNull: false,
      defaultValue: 'member',
    });
  },
};