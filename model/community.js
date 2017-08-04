
var Sequelize = require('sequelize');
var sequelize = require('../lib/mysql');
var Pps = require('./pps');

var Community = sequelize.define('community_info', {

    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true},

    name: {type: Sequelize.STRING},

    addr_in: {type: Sequelize.STRING},

    addr_out: {type: Sequelize.STRING},

    longitude: {type: Sequelize.STRING(64)},

    latitude: {type: Sequelize.STRING(64)},

    //pps_manufacture: {type: Sequelize.INTEGER, references: {model: 'pps_manufacture', key: 'id'}},
    pps_id: {type: Sequelize.INTEGER, allowNull: false},

    parking_num_total: {type: Sequelize.INTEGER},

    parking_num_share: {type: Sequelize.INTEGER},

    parking_num_remain: {type: Sequelize.INTEGER},

    parking_time_start: {type: Sequelize.TIME},

    parking_time_end:  {type: Sequelize.TIME},

    rate_type: {type: Sequelize.ENUM, values: ['month','time','hour']},

    rate: {type: Sequelize.INTEGER},

    is_checked: {type: Sequelize.BOOLEAN}

    },{

    freezeTableName: true

    }
);

Community.belongsTo(Pps, {foreignKey: 'pps_id'});


var community = Community.sync({force: false});
 
module.exports = Community;
