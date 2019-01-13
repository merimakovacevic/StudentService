const Sequelize = require('sequelize');
const sequelize = require('../connection');

const Zadatak = sequelize.define('zadatak', {
    naziv: {
      type: Sequelize.STRING
    },
    postavka: {
      type: Sequelize.STRING
    }
  });

  module.exports = Zadatak;