const Sequelize = require('sequelize');
const sequelize = require('../connection');

const Student = sequelize.define('student', {
    imePrezime: {
      type: Sequelize.STRING
    },
    index: {
      type: Sequelize.STRING,
      unique: true
    },
    id_godina: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
  });

  module.exports = Student;
