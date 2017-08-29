
var Parking = require('../model/parking');
var Order = require('../model/transaction');
var Community = require('../model/community');
var eventproxy = require('eventproxy');


exports.message_handle = function(req, res, next) {
    console.log('req='+JSON.stringify(req.body));
    if ('MSG_TYPE_PARKING_PUBLISH' == req.body.type) {
        publish(req, res, next);
    }
    else if ('MSG_TYPE_PARKING_MODIFY' == req.body.type) {
        modify(req, res, next);
    }
    else if ('MSG_TYPE_PARKING_CANCEL' == req.body.type) {
        cancel(req, res, next);
    }
    else if ('MSG_TYPE_PARKING_ORDER' == req.body.type) {
        order(req, res, next);
    }
    else if ('MSG_TYPE_PARKING_ORDER_PRE' == req.body.type) {
        orderPre(req, res, next);
    }
    else if ('MSG_TYPE_PARKING_ORDER_POST' == req.body.type) {
        orderPost(req, res, next);
    }
    else if ('MSG_TYPE_PARKING_ORDER_CANCEL' == req.body.type) {
        orderCancel(req, res, next);
    }
    else if ('MSG_TYPE_PARKING_GET_MY_ORDER' == req.body.type) {
        getMyOrder(req, res, next);
    }
    else if ('MSG_TYPE_GET_HISTORY_PARK_INFO' == req.body.type) {
        getHistoryPark(req, res, next);
    }
    else {
        next();
    }
};

function publish(req, res, next) {
    
    var user_id = req.session.user.id;
    var cid = req.body.cid;

    var parking = {
        user_id: user_id,
        community_id: cid,
        parking_time_start: req.body.timeStart,
        parking_time_end: req.body.timeEnd,
        rate_type: req.body.rateType,
        rate: req.body.price,
        info: req.body.info
    };

    Parking.addInfo(parking).then((data)=> {
        var retStr = {
            type: req.body.type,
            ret: 0,
            id: data.id
        };

        console.log(JSON.stringify(retStr)); 

        res.send(JSON.stringify(retStr));
    });
}

function modify(req, res, next) {

    var id = req.body.parkingId;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('pub_err', function(msg) {
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: msg
        };

        res.send(JSON.stringify(retStr));
    });

    (async () => {
        var data = await Parking.getDataById(id);
        if (!data) {
            ep.emit('pub_err','车位信息错误');
            return;
        }

        var newInfo = {
            info: req.body.info,
            parking_time_start: req.body.timeStart,
            parking_time_end: req.body.timeEnd,
            rate_type: req.body.rateType,
            rate: req.body.price
        };

        Parking.updatePublish(data, newInfo);

        var retStr = {
            type: req.body.type,
            ret: 0
        };

        res.send(JSON.stringify(retStr));

    }) ()

}

function cancel(req, res, next) {

    var id = req.body.parkingId;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('pub_err', function(msg) {
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: msg
        };

        res.send(JSON.stringify(retStr));
    });

    (async () => {
        var data = await Parking.getDataById(id);
        if (!data) {
            ep.emit('pub_err','车位信息错误');
            return;
        }

        Parking.deletePublish(data);

        var retStr = {
            type: req.body.type,
            ret: 0
        };

        res.send(JSON.stringify(retStr));

    }) ()


}


function order(req, res, next) {

    var community_id = req.body.communityId;
    var user_id = req.session.user.id;
    var mode = req.body.mode;
    var info = req.body.parkingInfo;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('order_err', function(msg) {
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: msg
        };

        res.send(JSON.stringify(retStr));
    });

    var newOrder = {
        user_id: user_id,
        community_id: community_id,
        mode: mode,
        info: info
    }; 

    Order.newAndSave(newOrder).then((order) => {
        if (!order) {
            ep.emit('order_err', '数据库错误');
            return;
        }

        var retStr = {
            type: req.body.type,
            ret: 0,
            orderId: order.id
        };

        res.send(JSON.stringify(retStr));
    });
}

function orderPre(req, res, next) {

    var uid = req.session.user.id;
    var cid = req.body.cid;
    var resId = req.body.resId;

    var resr = resId.split('_');
    var pay;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('order_err', function(msg) {
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: msg
        };

        res.send(JSON.stringify(retStr));
    });

    (async () => {

        if (resr[0] === 'c') {
            var xiaoqu = await Community.getXiaoquById(resr[1]);
            if (!xiaoqu) {
                ep.emit('order_err', '小区信息错误');
                return;
            }

            pay = xiaoqu.rate;
        }
        else {
            var parking = await Parking.getDataById(resr[1]);
            if (!parking) {
                ep.emit('order_err', '车位信息错误');
                return;
            }

            pay = parking.rate;
        }

        var newOrder ={
            user_id: uid,
            community_id: cid,
            info: resId,
            state: 'pre'
        };

        var order = await Order.newAndSave(newOrder);
        if (!order) {
            ep.emit('order_err', '订单系统出错');
            return;
        }

        var retStr = {
            type: req.body.type,
            ret: 0,
            resId: resId,
            orderNumber: order.id,
            pay: pay
        };

        res.send(JSON.stringify(retStr));
    }) ()

}

function orderPost(req, res, next) {

    var id = req.body.orderNumber;
    //var pay = req.body.pay;
    //var timeStart = req.body.timeStart;
    //var timeEnd = req.body.timeEnd;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('order_err', function(msg) {
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: msg
        };

        res.send(JSON.stringify(retStr));
    });

    (async () => {
        var order = await Order.getOrderById(id);
        if (!order) {
            ep.emit('order_err', '订单号错误');
            return;
        }

        var newOrder = {
            //in_time: timeStart,
            //out_time: timeEnd,
            //amount: pay,
            state: 'finish'
        };

        await Order.updateOrder(order, newOrder);

        var retStr = {
            type: req.body.type,
            ret: 0
        };

        res.send(JSON.stringify(retStr));
    }) ()
    
}

function orderCancel(req, res, next) {
    
    var id = req.body.orderNumber;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('order_err', function(msg) {
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: msg
        };

        res.send(JSON.stringify(retStr));
    });

    (async () => {
        var order = await Order.getOrderById(id);
        if (!order) {
            ep.emit('order_err','订单号错误');
            return;
        }

        Order.deleteOrder(order);

        var retStr = {
            type: req.body.type,
            ret: 0
        };

        res.send(JSON.stringify(retStr));

    }) ()

}

function getMyOrder(req, res, next) {

    var uid = req.session.user.id;
    var data;

    (async () => {
        var order = Order.queryOrder({'user_id': uid, 'state': 'pre'});

        if (!order) {
            var xiaoqu = await Community.getXiaoquById(order.community_id);
            
            data = {
                orderNumber: order.id,
                communityName: xiaoqu.name,
                price: xiaoqu.rate,
                priceType: xiaoqu.rate_type,
                deposit: xiaoqu.rate,
                timeStart: orders.in_time,
                timeEnd: orders.out_time,
                totalPrice: orders.amount
            };
        }

        var retStr = {
            type: req.body.type,
            ret: 0,
            data: data
        };

        res.send(JSON.stringify(retStr));

    }) ()
}


function getHistoryPark(req, res, next) {
    
    var uid = req.session.user.id;
    var start = parseInt(req.body.startIdx) - 1;
    var num = parseInt(req.body.num);
    var data = [];

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('order', function(data) {
        var retStr = {
            type: req.body.type,
            ret: 0,
            data: data
        };

        res.send(JSON.stringify(retStr));
    });

    (async () => {
        var orders = await Order.getOrdersByLimit(uid, num, start, [['createdAt', 'desc']]);
                
        if (orders.length == 0) {
            ep.emit('order', []);
            return;
        }

        for (var i in orders) {
            var xiaoqu = await Community.getXiaoquById(orders[i].community_id);
            
            var list = {
                date: orders[i].createdAt,
                communityName: xiaoqu.name,
                timeStart: orders[i].in_time,
                timeEnd: orders[i].out_time,
                totalPrice: orders[i].amount
            };

            data.push(list);
        }

        ep.emit('order', data);

    }) ()
}
