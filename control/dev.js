
var Dev = require('../model/dev');
var eventproxy = require('eventproxy');

exports.add = function(req, res, next) {
    var dir = req.body.dir;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('err', function(msg) {
        var retStr = {
            ret: msg.ret,
            msg: msg.str
        };

        res.send(JSON.stringify(retStr));
    });

    if (dir == 'in') {
        (async() => {
            var carIn = {
                chepai: req.body.chepai,
                xqname: req.body.cname,
                in_time: new Date()
            };

            var dev = await Dev.newAndSave(carIn);
            if (!dev) {
                ep.emit('err', '数据库错误');
                return;
            }
        }) ()
    }
    else if (dir == 'out') {
        (async() => {
            var filter = {
                chepai: req.body.chepai,
                xqname: req.body.cname,
                in_time: {'$not': null}
            };

            var dev = await Dev.queryOne(filter);
            if (!dev) {
                ep.emit('err', {ret:8002, str:'该车没有进场记录'});
                return;
            }

            var car_out ={
                out_time: new Date() 
            };

            Dev.update(dev, car_out);

        }) ()
    }
    else {
        ep.emit('err', {ret:8002, str:'参数错误'});
    }

    next();
};

