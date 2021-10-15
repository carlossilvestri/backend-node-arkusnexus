const Sequelize = require('sequelize');

const sequelize = require('../../config/database');


const tableName = 'role';
/*
(Tabla)
name
id_role
*/
const Role = sequelize.define('Role', {
    id_role: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
  }
}, { tableName });


module.exports = Role;
