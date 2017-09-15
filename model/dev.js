
var Sequelize = require('sequelize');
var sequelize = require('../lib/mysql');
var Community = require('./community');

var Dev = sequelize.define('dev', {

    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true},
    
    chepai: {type: Sequelize.STRING},

    xqname: {type: Sequelize.STRING},

    in_time: {type: Sequelize.DATE},
    out_time: {type: Sequelize.DATE},

    dev_id: {type: Sequelize.STRING},

    pps_id: {type: Sequelize.INTEGER},
    community_id: {type: Sequelize.INTEGER},

    }, {

    freezeTableName: true

    }
);

var dev = Dev.sync({force: false});

Dev.newAndSave = function(car) {
    return Dev.create({
        chepai: car.chepai,
        xqname: car.xqname,
        in_time: car.in_time,
        community_id: car.community_id,
        dev_id: car.dev_id,
        pps_id: car.pps_id
    });
};

Dev.queryOne = function(filter) {
    return Dev.findOne({
        where: filter
    });
};

Dev.query = function(filter) {
    return Dev.findAll({
        where: filter
    });
};

Dev.update = function(dev, newDev) {
    dev.chepai = newDev.chepai;
    dev.xqname = newDev.xqname;
    dev.in_time = newDev.in_time;
    dev.out_time = newDev.out_time;
    dev.community_id = newDev.community_id;
    dev.dev_id = newDev.dev_id;

    dev.save();
};

module.exports = Dev;
