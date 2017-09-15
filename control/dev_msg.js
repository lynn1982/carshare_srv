
var Dev = require('../model/dev');
var Community = require('../model/community');
var eventproxy = require('eventproxy');
var order = require('./parking');

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

            order.carInHandler(cid, chepai, in_time);
            
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

            order.carOutHandler(cid, chepai, out_time);

        }
    }) ()
}


module.exports.message_handle = message_handle;
