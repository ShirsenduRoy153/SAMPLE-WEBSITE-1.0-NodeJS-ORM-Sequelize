'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('u3s', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      addedu_id: {
        type: Sequelize.INTEGER
      },
      degree: {
        type: Sequelize.STRING
      },
      board: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      },
      marks: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('u3s');
  }
};