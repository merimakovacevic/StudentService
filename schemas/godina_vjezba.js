const Sequelize = require('sequelize');
const sequelize = require('../connection');

const GodinaVjezba = sequelize.define('godina_vjezba', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_godina: {
        type: Sequelize.INTEGER
    },
    id_vjezba: {
        type: Sequelize.INTEGER
    }
});

module.exports = GodinaVjezba;
