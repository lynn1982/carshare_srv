
var Sequelize = require('sequelize');
var sequelize = require('../lib/mysql');
var Community = require('./community');
var User = require('./user');

var Transaction = sequelize.define('transaction', {

    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true},

    //community: {type: Sequelize.INTEGER, references: {model: 'community_info', key: 'id'}},

    //user: {type: Sequelize.INTEGER, references: {model: 'user', key: 'id'}},

    in_time: {type: Sequelize.DATE},

    out_time:  {type: Sequelize.DATE},

    info: {type: Sequelize.STRING},

    mode: {type: Sequelize.ENUM, values: ['instant', 'advanced'], defaultValue: 'instant'},

    amount: {type: Sequelize.INTEGER},

    per_amount: {type: Sequelize.INTEGER},

    state: {type: Sequelize.ENUM, values: ['pre', 'progress', 'finish', 'cancel']}

    },{

    freezeTableName: true
    
    }
);

Transaction.belongsTo(Community, {foreignKey: 'community_id', onDelete: 'SET NULL', constraints: false});
Transaction.belongsTo(User, {foreignKey: 'user_id',  onDelete: 'SET NULL', constraints: false});

var transaction = Transaction.sync({force: false});

Transaction.newAndSave = function(order) {
    return Transaction.create({
        user_id: order.user_id,
        community_id: order.community_id,
        info: order.info,
        mode: order.mode,
        state: order.state,
        in_time: order.in_time,
        out_time: order.out_time
    });
};

Transaction.getOrderById = function(orderId) {
    return Transaction.findOne({
        where: {id: orderId}
    });
};

Transaction.deleteOrder = function(order) {
    order.destroy();
};

Transaction.updateOrder = function(order, newOrder) {
    order.in_time = newOrder.in_time;
    order.out_time = newOrder.out_time;
    order.amount = newOrder.amount;
    order.state = newOrder.state;

    order.save();
};

Transaction.getOrdersByUser = function(uid) {
    return Transaction.findAll({
        where: {user_id: uid}
    });
};

Transaction.queryOrder = function(query) {
    return Transaction.findOne({
        where: query
    });
};


Transaction.getOrdersByLimit = function(uid, limit, offset, order) {
    return Transaction.findAll({
        where: {user_id: uid},
        'limit': limit,
        'offset': offset,
        'order': order
    });
};

module.exports = Transaction;
