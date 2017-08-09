
var Sequelize = require('sequelize');
var sequelize = require('../lib/mysql');

var User = sequelize.define('user', {

    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true},

    wx_name: {type: Sequelize.STRING},

    wx_id: {type: Sequelize.STRING},

    login_name: {type: Sequelize.STRING(64)},

    passwd: {type: Sequelize.STRING},

    phone_num: {type: Sequelize.CHAR(11)},

    car_license: {type: Sequelize.STRING},

    score: {type: Sequelize.INTEGER},

    is_active: {type: Sequelize.BOOLEAN, defaultValue: false}
    
    }, {

    freezeTableName: true

    }
);

var user = User.sync({force: false});


User.getUsersByQuery = function(query) {
    return User.findAll({
        where: query
    });
};

User.newAndSave = function(user) {
    return User.create({
        login_name: user.login_name,
        passwd: user.passwd,
        phone_num: user.phone_num,
    });
};

User.getUserByPhone = function(phone_num) {
    return User.findOne({
        where: {phone_num: phone_num}
    });
}

User.getUserByName = function(name) {
    return User.findOne({
        where: {login_name: name}
    });
}


module.exports = User;
