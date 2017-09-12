
var Sequelize = require('sequelize');
var sequelize = require('../lib/mysql');
var Community = require('./community');
var User = require('./user');

var Transaction = sequelize.define('transaction', {

    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true},

    //community: {type: Sequelize.INTEGER, references: {model: 'community_info', key: 'id'}},
    //user: {type: Sequelize.INTEGER, references: {model: 'user', key: 'id'}},

    info: {type: Sequelize.STRING},
    mode: {type: Sequelize.ENUM, values: ['instant', 'advanced'], defaultValue: 'instant'},

    o_in_time: {type: Sequelize.DATE},
    o_out_time:  {type: Sequelize.DATE},
    c_in_time: {type: Sequelize.DATE},
    c_out_time:  {type: Sequelize.DATE},

    deposit: {type: Sequelize.INTEGER},
    margin: {type: Sequelize.INTEGER},
    o_amount: {type: Sequelize.INTEGER},
    amount: {type: Sequelize.INTEGER},

    per_amount: {type: Sequelize.INTEGER},
    price_type: {type: Sequelize.ENUM, values: ['hour', 'time', 'month']},

    state: {type: Sequelize.ENUM, values: ['pre', 'progress', 'finish', 'cancel']},
    chepai: {type: Sequelize.STRING},
    xqname: {type: Sequelize.STRING}

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
        o_in_time: order.o_in_time,
        o_out_time: order.o_out_time,
        xqname: order.xqname,
        chepai: order.chepai,
        price_type: order.price_type,
        deposit: order.deposit,
        o_amount: order.o_amount
    });
};

Transaction.getOrderById = function(orderId) {
    return Transaction.findOne({
        where: {id: orderId}
    });
};

Transaction.deleteOrder = function(order) {
    order.state = 'cancel';
    order.save();
};

Transaction.updateOrder = function(order, newOrder) {
    order.o_in_time = newOrder.o_in_time;
    order.o_out_time = newOrder.o_out_time;
    order.c_in_time = newOrder.c_in_time;
    order.c_out_time = newOrder.c_out_time;
    order.amount = newOrder.amount;
    order.o_amount = newOrder.o_amount;
    order.per_amount = newOrder.per_amount;
    order.state = newOrder.state;
    order.margin = newOrder.margin;

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

Transaction.query = function(qfilter) {
    var filter = {
        where: qfilter
    };

    return Transaction.findAll(filter);
};

module.exports = Transaction;
