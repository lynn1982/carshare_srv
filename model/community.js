
var Sequelize = require('sequelize');
var sequelize = require('../lib/mysql');
var Pps = require('./pps');
var User = require('./user');

var Community = sequelize.define('community_info', {

    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true},

    name: {type: Sequelize.STRING},
    city: {type: Sequelize.STRING},
    district: {type: Sequelize.STRING},

    addr_in: {type: Sequelize.STRING},
    addr_out: {type: Sequelize.STRING},

    longitude: {type: Sequelize.STRING(64)},
    latitude: {type: Sequelize.STRING(64)},
    
    phone: {type: Sequelize.CHAR(11)},
    contacts: {type: Sequelize.STRING(64)},
    email: {type: Sequelize.STRING},


    //pps_manufacture: {type: Sequelize.INTEGER, references: {model: 'pps_manufacture', key: 'id'}},
    //pps_id: {type: Sequelize.INTEGER, allowNull: false},
    //mgmt_id: {type: Sequelize.INTEGER, allowNull: false},

    parking_num_total: {type: Sequelize.INTEGER},
    parking_num_share: {type: Sequelize.INTEGER},
    parking_num_remain: {type: Sequelize.INTEGER},
    parking_time_start: {type: Sequelize.TIME},
    parking_time_end:  {type: Sequelize.TIME},
    rate_type: {type: Sequelize.ENUM, values: ['month','time','hour']},
    rate: {type: Sequelize.INTEGER},

    is_checked: {type: Sequelize.BOOLEAN, defaultValue: false}

    },{

    freezeTableName: true

    }
);

Community.belongsTo(Pps, {foreignKey: 'pps_id',  onDelete: 'SET NULL', constraints: false});
Community.belongsTo(User, {foreignKey: 'mgmt_id',  onDelete: 'SET NULL', constraints: false});


var community = Community.sync({force: false});
 

Community.newAndSave = function(xiaoqu) {

    return Community.create({
        name: xiaoqu.name,
        city: xiaoqu.city,
        district: xiaoqu.district,
        addr_in: xiaoqu.addr_in,
        addr_out: xiaoqu.addr_out,
        longitude: xiaoqu.longitude,
        latitude: xiaoqu.latitude,
        pps_id: xiaoqu.pps_id,
        //mgmt_id: xiaoqu.mgmt_id,
        phone: xiaoqu.phone,
        contacts: xiaoqu.contacts,
        email: xiaoqu.email,

        parking_num_total: xiaoqu.parking_num_total,
        parking_time_start: xiaoqu.parking_time_start,
        parking_time_end: xiaoqu.parking_time_end,
        rate_type: xiaoqu.rate_type,
        rate: xiaoqu.rate
    });
    
};

Community.updateXiaoqu = function(xiaoqu, newData) {

    xiaoqu.name = newData.name;
    xiaoqu.city = newData.city;
    xiaoqu.district = newData.district;
    xiaoqu.addr_in = newData.addr_in;
    xiaoqu.addr_out = newData.addr_out;
    xiaoqu.longitude = newData.longitude;
    xiaoqu.latitude = newData.latitude;
    //xiaoqu.pps_id = newData.pps_id;
    xiaoqu.phone = newData.phone;
    xiaoqu.contacts = newData.contacts;
    xiaoqu.email = newData.email;

    xiaoqu.parking_num_total = newData.parking_num_total;
    xiaoqu.parking_num_share = newData.parking_num_share;
    xiaoqu.parking_num_remain = newData.parking_num_remain;
    xiaoqu.parking_time_start = newData.parking_time_start;
    xiaoqu.parking_time_end = newData.parking_time_end;
    xiaoqu.rate_type = newData.rate_type;
    xiaoqu.rate = newData.rate;
    xiaoqu.is_checked = newData.is_checked;

    xiaoqu.save();
};

Community.getXiaoquByUid = function(uid) {

    return Community.findAll({
        where: {mgmt_id: uid}
    });
};

Community.getXiaoquById = function(id) {
    
    return Community.findOne({
        where: {id: id}
    });
};

Community.deleteXiaoqu = function(xiaoqu) {
    xiaoqu.destroy();
};

Community.getXiaoquByScope = function(lonStart, lonEnd, latStart, latEnd) {
    return Community.findAll({
        where: {
            'longitude': {'$between': [lonStart, lonEnd]},
            'latitude': {'$between': [latStart, latEnd]}
        }
    });
};

Community.queryXiaoqu = function(name, city, district) {
    var filter = {
        where: {
        }
    };
    console.log(JSON.stringify(filter));

    if (typeof(name) != "undefined") {
        var str = '%';
        var qstr = str.concat(name, '%');
        filter.where.name = {
            '$like': qstr
        };
    }

    if (typeof(city) != "undefined") {
        filter.where.city = city;
    }

    if (typeof(district) != "undefined") {
        filter.where.district = district;
    }

    return Community.findAll(filter);
};


Community.query = function(qfilter) {
    var filter = {
        where: qfilter
    };

    return Community.findAll(filter);
};

module.exports = Community;
