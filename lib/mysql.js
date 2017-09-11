
var config = require('../config');
var Sequelize = require('sequelize');

module.exports = new Sequelize(config.database, config.db_username, config.db_passwd,{
    host: config.host,
    port: 3306,
    dialect: 'mysql',
    timezone: '+08:00' //东八时区
});


//module.exports = sequelize;
