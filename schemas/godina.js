const Sequelize = require('sequelize');
const sequelize = require('../connection');

const Godina = sequelize.define('godina', {
    naziv: {
      type: Sequelize.STRING,
      unique: true
    },
    nazivRepSpi: {
      type: Sequelize.STRING
    },
    nazivRepVje: {
        type: Sequelize.STRING
    }
});

module.exports = Godina;
