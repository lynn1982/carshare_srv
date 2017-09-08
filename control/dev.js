
var Dev = require('../model/dev');

exports.add = function(req, res, next) {

    var in_time = req.body.in_time;
    var out_time = req.body.out_time;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('err', function(msg) {
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: msg
        };

        res.send(JSON.stringify(retStr));
    });

    if (out_time === 'undefined') {

        (async() => {
            var carIn = {
                chepai: req.body.chepai,
                xqname: req.body.xqname,
                in_time: in_time
            };

            var dev = await Dev.newAndSave(carIn);
            if (!dev) {
                ep.emit('err', '数据库错误');
                return;
            }
        }) ()
    }
    else if (in_time === 'undefined') {
        
        (async() => {
            var filter = {
                chepai: req.body.chepai,
                xqname: req.body.xqname,
                in_time: {'$not': null}
            };

            var dev = await Dev.queryOne(filter);
            if (!dev) {
                ep.emit('err', '该车没有进场记录');
                return;
            }

            var car_out ={
                out_time: out_time
            };

            Dev.update(dev, car_out);

        }) ()
    }
    else {
        ep.emit('err', '参数没有进出场记录');
    }

};

