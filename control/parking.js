
var Parking = require('../model/parking');
var Order = require('../model/transaction');
var eventproxy = require('eventproxy');


exports.message_handle = function(req, res, next) {
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
    else if ('MSG_TYPE_PARKING_ORDER_CANCEL' == req.body.type) {
        orderCancel(req, res, next);
    }
    else {
        next();
    }
};

function publish(req, res, next) {
    
    var user_id = req.session.user.id;
    var community_id = req.body.communityId;
    var time_start = req.body.timeStart;
    var time_end = req.body.timeEnd;
    var info = req.body.info;

    var parking = {
        user_id: user_id,
        community_id: community_id,
        parking_time_start: time_start,
        parking_time_end: time_end,
        info: info
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
    var time_start = req.body.timeStart;
    var time_end = req.body.timeEnd;
    var info = req.body.info;

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
            info: info,
            time_start: time_start,
            time_end: time_end
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

function orderCancel(req, res, next) {
    
    var id = req.body.orderId;

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


