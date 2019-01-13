const Sequelize = require('sequelize');
const sequelize = require('../connection');

  const Vjezba = sequelize.define('vjezba', {
    naziv: {
      type: Sequelize.STRING,
      unique: true
    },
    spirala: {
      type: Sequelize.BOOLEAN
    }
  });

  module.exports = Vjezba;
