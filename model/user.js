
var Sequelize = require('sequelize');
var sequelize = require('../lib/mysql');

var User = sequelize.define('user', {

    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true},

    wx_name: {type: Sequelize.STRING},

    wx_id: {type: Sequelize.STRING},

    login_name: {type: Sequelize.STRING(64)},

    passwd: {type: Sequelize.STRING},

    sex: {type: Sequelize.ENUM, values: ['male', 'female']},

    phone_num: {type: Sequelize.CHAR(11), unique: true},

    car_license: {type: Sequelize.STRING},

    score: {type: Sequelize.INTEGER},

    is_active: {type: Sequelize.BOOLEAN, defaultValue: false},

    is_mgmt: {type: Sequelize.BOOLEAN, defaultValue: false},

    role: {type: Sequelize.ENUM, values: ['super', 'normal', 'pps', 'property'], defaultValue: 'normal'}
    
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
        is_active: user.is_active,
        is_mgmt: user.is_mgmt,
        role: user.role
    });
};

User.getUserByPhone = function(phone_num) {
    return User.findOne({
        where: {phone_num: phone_num}
    });
};

User.getUserByName = function(name) {
    return User.findOne({
        where: {login_name: name}
    });
};

User.getUserById = function(id) {
    return User.findOne({
        where: {id: id}
    });
};

User.setUserActive = function(user) {
    user.is_active = true;
    user.save();
};

User.updateUser = function(user, newUser) {
    user.login_name = newUser.login_name;
    user.sex = newUser.sex;
    user.car_license = newUser.car_license;

    user.save();
};

User.deleteUser = function(user) {
    user.destroy();
};

module.exports = User;
