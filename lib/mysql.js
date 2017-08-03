
var config = require('../config');
var Sequelize = require('sequelize');

module.exports = new Sequelize(config.database, config.db_username, config.db_passwd,{
    host: config.host,
    port: 3306,
    dialect: 'mysql'
});


//module.exports = sequelize;
