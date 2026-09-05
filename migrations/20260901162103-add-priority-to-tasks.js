module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tasks', 'priority', {
      type: Sequelize.ENUM('low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'medium',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Tasks', 'priority');
  },
};