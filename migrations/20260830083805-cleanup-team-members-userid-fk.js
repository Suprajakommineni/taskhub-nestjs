'use strict';

module.exports = {
  async up(queryInterface) {
    // Drop the two redundant duplicate foreign keys, keep only teammembers_ibfk_2
    await queryInterface.sequelize.query(
      'ALTER TABLE `teammembers` DROP FOREIGN KEY `teammembers_ibfk_3`',
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE `teammembers` DROP FOREIGN KEY `TeamMembers_userId_foreign_idx`',
    );

    // Now that only one FK remains, this will actually stick
    await queryInterface.sequelize.query(
      'ALTER TABLE `teammembers` MODIFY COLUMN `userId` INT NOT NULL',
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE `teammembers` MODIFY COLUMN `userId` INT NULL',
    );
    // Not recreating the two duplicate FKs on rollback — they were
    // accidental duplicates, not an intentional part of the schema.
  },
};