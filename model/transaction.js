
var Sequelize = require('sequelize');
var sequelize = require('../lib/mysql');

var Transaction = sequelize.define('transaction', {

    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true};

    //community: {type: Sequelize.INTEGER, references: {model: 'community_info', key: 'id'}},

    //user: {type: Sequelize.INTEGER, references: {model: 'user', key: 'id'}},

    in_time: {type: Sequelize.DATE},

    out_time:  {type: Sequelize.DATE},

    info: {type: Sequelize.STRING},

    mode: {type: Sequelize.ENUM, values: ['instant', 'advanced'], defaultValue: 'instant'},

    amount: {type: Sequelize.INTEGER},

    per_amount: {type: Sequelize.INTEGER}

    },{

    freezeTableName: true
    
    }
);

Transaction.belongsTo(Community, {foreignKey: 'community_id'});
Transaction.belongsTo(User, {foreignKey: 'user_id'});

var transaction = Transaction.sync({force: false});

module.exports = Transaction;
