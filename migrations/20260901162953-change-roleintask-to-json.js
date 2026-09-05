module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('TaskAssignees', 'roleinTask', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('TaskAssignees', 'roleinTask', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};