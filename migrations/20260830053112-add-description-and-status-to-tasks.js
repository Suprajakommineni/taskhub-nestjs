'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tasks', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('Tasks', 'status', {
      type: Sequelize.ENUM(
        'todo',
        'in_progress',
        'review',
        'completed',
      ),
      allowNull: false,
      defaultValue: 'todo',
    });

    // Preserve completion state from the old boolean column
    await queryInterface.sequelize.query(`
      UPDATE Tasks
      SET status = 'completed'
      WHERE done = true
    `);

    await queryInterface.removeColumn('Tasks', 'done');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tasks', 'done', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.sequelize.query(`
      UPDATE Tasks
      SET done = true
      WHERE status = 'completed'
    `);

    await queryInterface.removeColumn('Tasks', 'status');
    await queryInterface.removeColumn('Tasks', 'description');
  },
};