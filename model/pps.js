
var Sequelize = require('sequelize');
var sequelize = require('../lib/mysql');

var Pps = sequelize.define('pps_manufacture', {

    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true},

    name: {type: Sequelize.STRING},
    
    }, {

    freezeTableName: true

    }
);

var pps = Pps.sync({force: false});


module.exports = Pps;
