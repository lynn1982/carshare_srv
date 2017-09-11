
var Dev = require('../model/dev');
var Community = require('../model/community');
var eventproxy = require('eventproxy');

function message_handle(packet){
    var topic = packet.topic;
    var payload = JSON.stringify(packet.payload);

    /* {"dev_id":123456,"xiaoqu_id":000001,"chepai":"沪A-AA001"} */
    var cid = payload.xiaoqu_id;
    var devId = payload.dev_id;
    var chepai = payload.chepai;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('err', function(msg) {
        var retStr = {
            ret: msg.ret,
            msg: msg.str
        };

        res.send(JSON.stringify(retStr));
    });

    console.log("topic="+topic+",payload="+payload.toString());

    (async() => {
        var xiaoqu = await Community.getXiaoquById(cid);
        if (!xiaoqu) {
            ep.emit('err', {ret:8001, str:'没有此小区'});
            return;
        }

        var cname = xiaoqu.name;

        if (topic == 'car_in') {
            var CarIn = {
                chepai: chepai,
                xqname: cname,
                community_id: cid,
                dev_id: devId,
                in_time: new Date()
            };

            var dev = await Dev.newAndSave(carIn);
            if (!dev) {
                ep.emit('err', {ret:8002, str:'数据库错误'});
                return;
            }
        }
        else if (topic == 'car_out') {
            var filter = {
                chepai: chepai,
                community_id: cid,
                in_time: {'$not': null}
            };

            var dev = await Dev.queryOne(filter);
            if (!dev) {
                ep.emit('err', {ret:8002, str:'该车没有进场记录'});
                return;
            }

            var car_out = {
                out_time: new Date()
            };

            Dev.update(dev, car_out);
        }
    }) ()

}

module.exports.message_handle = message_handle;
