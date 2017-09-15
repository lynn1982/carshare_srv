
var Dev = require('../model/dev');
var Community = require('../model/community');
var Order = require('../model/transaction');
var eventproxy = require('eventproxy');
var xiaoqu = require('./xiaoqu');

var expireTime = 15;

function message_handle(packet){
    var topic = packet.topic;
    var payload = packet.payload.toString();

    console.log("topic="+topic+",payload="+payload); 

    if (topic != 'car_in' && topic != 'car_out') {
        return;
    }

    var json = JSON.parse(payload);
    var cid = json.xiaoqu_id;
    var devId = json.dev_id;
    var chepai = json.chepai;

    var in_time;
    var out_time;

    /* {"dev_id":123456,"xiaoqu_id":000001,"chepai":"沪A-AA001"} */

    /*var ep = new eventproxy();
    ep.fail();
    ep.on('err', function(msg) {
        var retStr = {
            ret: msg.ret,
            msg: msg.str
        };

        res.send(JSON.stringify(retStr));
    });*/

    (async() => {
        var xiaoqu = await Community.getXiaoquById(cid);
        if (!xiaoqu) {
            //ep.emit('err', {ret:8001, str:'没有此小区'});
            return;
        }

        var cname = xiaoqu.name;

        if (topic == 'car_in') {
            in_time = new Date();
            var carIn = {
                chepai: chepai,
                xqname: cname,
                community_id: cid,
                dev_id: devId,
                in_time: in_time
            };

            var dev = await Dev.newAndSave(carIn);
            if (!dev) {
                //ep.emit('err', {ret:8002, str:'数据库错误'});
                return;
            }
            
        }
        else if (topic == 'car_out') {
            out_time = new Date();
            var filter = {
                chepai: chepai,
                community_id: cid,
                in_time: {'$not': null},
                out_time: {'$eq': null}
            };

            var dev = await Dev.queryOne(filter);
            if (!dev) {
                //ep.emit('err', {ret:8002, str:'该车没有进场记录'});
                return;
            }

            var car_out = {
                out_time: out_time
            };

            await Dev.update(dev, car_out);

        }
    }) ()

    if (topic == 'car_in') {
        carInHandler(cid, chepai, in_time);
    }
    else if (topic == 'car_out') {
        carOutHandler(cid, chepai, out_time);
    }
}

function carInHandler(cid, chepai, in_time) {
    (async() => {
        var filter = {
            community_id: cid,
            chepai: chepai,
            state: 'progress'
        };

        var order = await Order.queryOrder(filter);
        if (!order) {
            return;
        }
        
        var timeIn = {
            c_in_time: in_time
        };

        await Order.updateOrder(order, timeIn);
       
    }) ()
}

function carOutHandler(cid, chepai, out_time) {
    var timeOut;

    (async() => {
        var query = {
            chepai: chepai,
            community_id: cid,
            c_out_time: {'$eq': null},
            state: {'$in': ['progress','outpay']},
            //pay_time: {'$ne': null}
        };

        var order = await Order.queryOrder(query);
        if (!order) {
            return;
        }

        var state = order.state;

        if (state == 'progress') {
            timeOut = {
                c_out_time: out_time,
                state: 'prepay'
            };
        }
        else {
            timeOut = {
                c_out_time: out_time,
                state: 'finish'
            };

            var pay_time = order.pay_time;
            var mics = out_time.getTime() - pay_time.getTime();
            var min = Math.floor(mics/(60*1000));

            console.log('time_expire='+min);
        }

        await Order.updateOrder(order, timeOut);

        xiaoqu.updateCheweiCount(cid, 1, true);

        if (state == 'outpay') {
            if (min > expireTime) {
                // expire 15mins,report mqtt
            }

        }
    }) ()
}

module.exports.message_handle = message_handle;
