'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProjectTeams', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      projectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Projects', key: 'id' },
        onDelete: 'CASCADE',
      },
      teamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Teams', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addConstraint('ProjectTeams', {
      fields: ['projectId', 'teamId'],
      type: 'unique',
      name: 'unique_project_team',
    });

    // Carry forward any project that already has a single team linked
    await queryInterface.sequelize.query(`
      INSERT INTO ProjectTeams (projectId, teamId, createdAt, updatedAt)
      SELECT id, teamId, NOW(), NOW() FROM Projects WHERE teamId IS NOT NULL
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ProjectTeams');
  },
};