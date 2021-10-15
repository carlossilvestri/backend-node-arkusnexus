const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');
const Team = require('./Team');


const tableName = 'Team_user';
/*
Users:
(Tabla)
id_team_user
beggining_date
ending_date
id_user_f
id_team_f
*/
const Team_user = sequelize.define('Team_user', {
    id_team_user: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  beggining_date: {
    type: Sequelize.DATE
  },
  ending_date: {
    type: Sequelize.DATE
  }
}, { tableName });

// Llaves foraneas.
Team_user.belongsTo(User, {as: 'User', foreignKey: 'id_user_f'});
Team_user.belongsTo(Team, {as: 'Team', foreignKey: 'id_team_f'});

module.exports = Team_user;
