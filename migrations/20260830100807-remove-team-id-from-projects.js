'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const [constraints] = await queryInterface.sequelize.query(`
      SELECT CONSTRAINT_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'Projects'
        AND COLUMN_NAME = 'teamId'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `);

    for (const { CONSTRAINT_NAME } of constraints) {
      await queryInterface.sequelize.query(
        `ALTER TABLE \`Projects\` DROP FOREIGN KEY \`${CONSTRAINT_NAME}\``,
      );
    }

    await queryInterface.removeColumn('Projects', 'teamId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Projects', 'teamId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Teams', key: 'id' },
      onDelete: 'SET NULL',
    });

    await queryInterface.sequelize.query(`
      UPDATE Projects p
      JOIN (
        SELECT projectId, MIN(teamId) AS teamId
        FROM ProjectTeams
        GROUP BY projectId
      ) pt ON pt.projectId = p.id
      SET p.teamId = pt.teamId
    `);
  },
};