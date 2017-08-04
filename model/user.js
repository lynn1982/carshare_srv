
var Sequelize = require('sequelize');
var sequelize = require('../lib/mysql');

var User = sequelize.define('user', {

    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true},

    wx_name: {type: Sequelize.STRING},

    wx_id: {type: Sequelize.STRING},

    passwd: {type: Sequelize.STRING},

    phone_num: {type: Sequelize.STRING},

    car_license: {type: Sequelize.STRING},

    score: {type: Sequelize.INTEGER}
    
    }, {

    freezeTableName: true

    }
);

var user = User.sync({force: false});

exports.addUser = function(user) {
    return User.create({
        wx_name: user.wx_name,
        wx_id: user.wx_id,
        phone_num: user.phone_num,
        passwd: user.passwd,
    });
};


module.exports = User;
