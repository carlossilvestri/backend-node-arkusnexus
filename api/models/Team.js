const Sequelize = require('sequelize');

const sequelize = require('../../config/database');


const tableName = 'team';
/*
(Tabla)
name
id_team
*/
const Team = sequelize.define('Team', {
    id_team: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
  }
}, { tableName });


module.exports = Team;
