const Sequelize = require('sequelize');
const sequelize = require('../connection');

const VjezbaZadatak = sequelize.define('vjezba_zadatak', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_vjezba: {
        type: Sequelize.INTEGER
    },
    id_zadatak: {
        type: Sequelize.INTEGER
    }
});

module.exports = VjezbaZadatak;
