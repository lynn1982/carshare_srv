
var Sequelize = require('sequelize');
var sequelize = require('../lib/mysql');
var Community = require('./community');
var User = require('./user');

var Parking = sequelize.define('parking_info', {

    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true},

    //community: {type: Sequelize.INTEGER, references: {model: 'community_info', key: 'id'}},
    //community_id: {type: Sequelize.INTEGER},

    //user: {type: Sequelize.INTEGER, references: {model: 'user', key: 'id'}},
    //user_id: {type: Sequelize.INTEGER},

    parking_time_start: {type: Sequelize.TIME},

    parking_time_end:  {type: Sequelize.TIME},

    rate_type: {type: Sequelize.ENUM, values: ['month','time','hour']},

    rate: {type: Sequelize.INTEGER},

    info: {type: Sequelize.STRING},

    is_checked: {type: Sequelize.BOOLEAN}

    }, {

    freezeTableName: true

    }
);

Parking.belongsTo(Community, {foreignKey: 'community_id',  onDelete: 'SET NULL', constraints: false});
Parking.belongsTo(User, {foreignKey: 'user_id',  onDelete: 'SET NULL', constraints: false});

var parking = Parking.sync({force: false});

Parking.addInfo = function(parking) {
    return Parking.create({
        user_id: parking.user_id,
        community_id: parking.community_id,
        parking_time_start: parking.parking_time_start,
        parking_time_end: parking.parking_time_end,
        rate_type: parking.rate_type,
        rate: parking.rate,
        info: parking.info
    });
};

Parking.getDataById = function(id) {
    return Parking.findOne({
        where: {id: id}
    });
};

Parking.deletePublish = function(data) {
    data.destroy();
};

Parking.updatePublish = function(data, newInfo) {
    data.info = newInfo.info;
    data.parking_time_start = newInfo.parking_time_start;
    data.parking_time_end = newInfo.parking_time_end;
    data.rate_type = newInfo.rate_type;
    data.rate = newInfo.rate;

    data.save();
};

Parking.getInfoByCommunityId = function(communityId) {
    return Parking.findAll({
        where: {community_id: communityId}
    });
};

module.exports = Parking;
