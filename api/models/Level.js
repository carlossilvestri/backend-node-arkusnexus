const Sequelize = require('sequelize');

const sequelize = require('../../config/database');


const tableName = 'level';
/*
(Tabla)
name
id_level
*/
const Level = sequelize.define('Level', {
    id_level: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
  }
}, { tableName });


module.exports = Level;
