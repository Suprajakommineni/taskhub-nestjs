'use strict';
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('Tasks', 'assignedToId');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tasks', 'assignedToId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    });
  },
};