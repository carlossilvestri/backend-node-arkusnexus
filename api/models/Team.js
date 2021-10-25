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
  },
  is_active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
}, { tableName });


module.exports = Team;
