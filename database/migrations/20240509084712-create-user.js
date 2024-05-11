'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contact: {
        type: Sequelize.STRING
      },
      birth_date: {
        type: Sequelize.DATE
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'else')
      },
      address: {
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      banned : {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
