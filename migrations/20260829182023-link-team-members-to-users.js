'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add the User link temporarily as optional
    await queryInterface.addColumn('TeamMembers', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    // 2. Link old members to Users by their existing email
    await queryInterface.sequelize.query(`
      UPDATE TeamMembers tm
      JOIN Users u ON u.email = tm.email
      SET tm.userId = u.id
    `);

    // 3. Make the link required
    await queryInterface.changeColumn('TeamMembers', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    // 4. Add one team role
    await queryInterface.addColumn('TeamMembers', 'role', {
      type: Sequelize.ENUM('lead', 'member'),
      allowNull: false,
      defaultValue: 'member',
    });

    // 5. Preserve old lead roles when possible
    await queryInterface.sequelize.query(`
      UPDATE TeamMembers
      SET role = CASE
        WHEN JSON_CONTAINS(roles, '"lead"') THEN 'lead'
        ELSE 'member'
      END
    `);

    // 6. Remove duplicated/old fields
    await queryInterface.removeColumn('TeamMembers', 'email');
    await queryInterface.removeColumn('TeamMembers', 'roles');

    // 7. Prevent the same user joining a team twice
    await queryInterface.addConstraint('TeamMembers', {
      fields: ['teamId', 'userId'],
      type: 'unique',
      name: 'unique_team_member',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'TeamMembers',
      'unique_team_member',
    );
    await queryInterface.addColumn('TeamMembers', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('TeamMembers', 'roles', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: [],
    });
    await queryInterface.removeColumn('TeamMembers', 'role');
    await queryInterface.removeColumn('TeamMembers', 'userId');
  },
};
