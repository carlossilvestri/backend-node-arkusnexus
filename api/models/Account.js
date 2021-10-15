const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');

const sequelize = require('../../config/database');
const Team = require('./Team');


const tableName = 'account';
/*
Users:
(Tabla)
id_account
is_active
id_team_f
responsible_operations_name
name_client
account_name
*/
const Account = sequelize.define('Account', {
  id_account: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  is_active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  responsible_operations_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name_client: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  account_name: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, { tableName });

// Llaves foraneas.
Account.belongsTo(Team, {as: 'Team', foreignKey: 'id_team_f'});

module.exports = Account;
