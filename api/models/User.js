const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');

const sequelize = require('../../config/database');
const Level = require('./Level');
const Role = require('./Role');


const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
  }
};

const tableName = 'user';
/*
Users:
(Tabla)
id_english_level_f
id_role_f
technical_knoledge
link_cv
is_active_user
role
password
email
name
id_user
*/
const User = sequelize.define('User', {
  id_user: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING,
    unique: {
      args: true,
      msg: 'Email ya registrado.'
    },
    validate:{
      isEmail: true,
    },
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
  },
  technical_knoledge: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  link_cv: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: 'NORMAL',
  },
  is_active_user: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
}, { hooks, tableName });

// Llaves foraneas.
User.belongsTo(Level, {as: 'Level', foreignKey: 'id_english_level_f'});
User.belongsTo(Role, {as: 'Role', foreignKey: 'id_role_f'});
// eslint-disable-next-line
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = User;
