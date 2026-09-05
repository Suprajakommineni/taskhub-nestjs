module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('TaskAssignees', 'roleinTask', {
      type: Sequelize.STRING, // or Sequelize.JSON if you kept it as an array
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('TaskAssignees', 'roleinTask');
  },
};