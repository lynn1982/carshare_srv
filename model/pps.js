
var Sequelize = require('sequelize');
var sequelize = require('../lib/mysql');
var User = require('./user');

var Pps = sequelize.define('pps_manufacture', {

    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true},

    name: {type: Sequelize.STRING},

    parkNum: {type: Sequelize.INTEGER}
    
    }, {

    freezeTableName: true

    }
);

Pps.belongsTo(User, {foreignKey: 'user_id', onDelete: 'SET NULL', constraints: false});

var pps = Pps.sync({force: false});

Pps.newAndSave = function(pps) {
    return Pps.create({
        name: pps.name,
        parkNum: pps.parkNum,
        user_id: pps.user_id
    });
};

Pps.deletePps = function(pps) {
    pps.destroy();
};

Pps.getPpsById = function(id) {
    return Pps.findOne({
        where: {id: id}
    });
};

Pps.updatePps = function(pps, newPps) {
    pps.name = newPps.name;
    pps.parkNum = newPps.parkNum;
    pps.user_id = newPps.user_id;

    pps.save();
};

Pps.queryPps = function(name) {
    var str = '%';
    var qstr = str.concat(name,'%');

    return Pps.findAll({
        where: {
            name: {'$like': qstr}
        }
    });
};

Pps.queryAllPps = function() {
    return Pps.findAll({
    });
};

module.exports = Pps;
