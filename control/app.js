
var Parking = require('../model/parking');

function message_handle(req, res) {

    if ('MSG_TYPE_PARKING_PUBLISH' == req.body.type) {
        publish(req, res);
    }
    else if ('MSG_TYPE_PARKING_PUBLISH_MODIFY' == req.body.type) {
        publish_modify(req, res);
    }
    else if ('MSG_TYPE_PARKING_PUBLISH_CANCEL' == req.body.type) {
        publish_cancel(req, res);
    }
    else if ('MSG_TYPE_PARKING_ORDER' == req.body.type) {
        order(req, res);
    }
    else if ('MSG_TYPE_PARKING_ORDER_CANCEL' == req.body.type) {
        order_cancel(req, res);
    }

}

function publish(req, res) {
    
    var user_id = req.body.userId;
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
            type: 'MSG_TYPE_PARKING_PUBLISH',
            ret: 0,
            id: data.id
        };

        console.log(JSON.stringify(retStr)); 

        res.send(JSON.stringify(retStr));
    });
}

function publish_modify(req, res) {

}

function publish_cancel(req, res) {
    
}

function order(req, res) {

}

function order_cancel(req, res) {
    
}

module.exports.message_handle = message_handle;
