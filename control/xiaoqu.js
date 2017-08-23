
var Community = require('../model/community');
var eventproxy = require('eventproxy');


exports.message_handle = function(req, res, next) {
    console.log("req="+JSON.stringify(req.body));
    var msgType = req.body.type;

    if ('MSG_T_MGMT_NEW_XIAOQU' == msgType) { 
        addXiaoqu(req, res, next);
    }
    else if ('MSG_T_MGMT_QUERY_XIAOQU' == msgType) {
        queryXiaoqu(req, res, next);
    }
    else if ('MSG_T_MGMT_UPDATE_XIAOQU' == msgType) {
        update(req, res, next);
    }
    else if ('MSG_T_MGMT_PUBLISH_XIAOQU' == msgType) {
        publish(req, res, next);
    }
    else if ('MSG_T_MGMT_DELETE_XIAOQU' == msgType) {
        del(req, res, next);
    }
    else if ('MSG_T_GET_AREA_CHEWEI' == msgType) {
        getAreaChewei(req, res, next);
    }
    else if ('MSG_T_GET_XIAOQU_CHEWEI' == msgType) {
        getXiaoquInfo(req, res, next);
    }
    else {
        next();
    }
};

function addXiaoqu(req, res, next) {

    var name = req.body.name;
    var addr_in = req.body.addr_in;

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


    if ([name, addr_in].some(function(item) {return item === '';})) {
        ep.emit('err', '小区名称和地址不能为空');
        return;
    }

    var newXiaoqu = {
        mgmt_id: req.session.user.id,
        name: name,
        city: req.body.city,
        district: req.body.district,
        addr_in: addr_in,
        addr_out: req.body.addr_out,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        pps_id: req.body.pps_id,
        parking_num_total: req.body.parking_num_total,
        parking_time_start: req.body.timeStart,
        parking_time_end: req.body.timeEnd,
        rate_type: req.body.rate_type,
        rate: req.body.rate
    };

    (async () => {
        var xiaoqu = await Community.newAndSave(newXiaoqu);

        if (!xiaoqu) {
            ep.emit('err', '数据库错误');
            return;
        }
        else {
            var retStr = {
                type: req.body.type,
                ret: 0,
                cid: xiaoqu.id
            };

            res.send(JSON.stringify(retStr));
        }

    }) ()

}

function queryXiaoqu(req, res, next) {
   
   var city = req.body.city;
   var district = req.body.district; 
   var name = req.body.name;
   var list = [];

   (async () => {

        var xiaoqus = await Community.queryXiaoqu(name, city, district);

        if (xiaoqus.length > 0) {
            
            for (var i =0; i < xiaoqus.length; i++) {
                list.push(xiaoqus[i]);
            }

        }

        var retStr = {
            type: req.body.type,
            ret: 0,
            data: list
        };

        res.send(JSON.stringify(retStr));

   }) ()

}

function query(req, res, next) {

    var mgmt_id = req.body.userId;

    (async () => {
        var xiaoqus = await Community.getXiaoquByUser(mgmt_id);

        if (xiaoqus.length == 0) {
            var retStr = {
                type: req.body.type,
                ret: 0,
                count: 0
            };

            res.send(JSON.stringify(retStr));
            return;
        }

        var retStr = {
            type: req.body.type,
            ret: 0,
            count: xiaoqus.length,
            info: xiaoqus
        };
        
        res.send(JSON.stringify(retStr));

                
    }) ()
}

function update(req, res, next) {

    var id = req.body.cid;

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

    (async () => {
        var xiaoqu = await Community.getXiaoquById(id);

        if (!xiaoqu) {
            ep.emit('err', '小区信息错误');
            return;
        }
        
        var newXiaoqu = {
            name: req.body.name,
            addr_in: req.body.addr_in,
            addr_out: req.body.addr_out,
            city: req.body.city,
            district: req.body.district,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            pps_id: req.body.pps_id,
            parking_num_total: req.body.parking_num_total,
            parking_time_start: req.body.timeStart,
            parking_time_end: req.body.timeEnd,
            rate_type: req.body.rateType,
            rate: req.body.price
        };

        Community.updateXiaoqu(xiaoqu, newXiaoqu);

        var retStr = {
            type: req.body.type,
            ret: 0,
        };

        res.send(JSON.stringify(retStr));

    }) ()

}

function publish(req, res, next) {

    var id = req.body.cid;

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

    (async () => {
        var xiaoqu = await Community.getXiaoquById(id);

        if (!xiaoqu) {
            ep.emit('err', '小区信息错误');
            return;
        }
        
        var newXiaoqu = {
            is_checked: true
        };

        Community.updateXiaoqu(xiaoqu, newXiaoqu);

        var retStr = {
            type: req.body.type,
            ret: 0,
        };

        res.send(JSON.stringify(retStr));

    }) ()

}

function del(req, res, next) {

    var id = req.body.cid;

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

    (async () => {
        var xiaoqu = await Community.getXiaoquById(id);
        if (!xiaoqu) {
            ep.emit('err','小区信息错误');
            return;
        }

        Community.deleteXiaoqu(xiaoqu);

        var retStr = {
            type: req.body.type,
            ret: 0
        };

        res.send(JSON.stringify(retStr));

    }) ()


}


function getXiaoquInfo(req, res, next) {
   
    var id = req.body.cid;
    var list = [];

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

    (async () => {
        
        var xiaoqu = await Community.getXiaoquById(id);
        if (!xiaoqu) {
            ep.emit('err', '获取小区信息失败');
            return;
        }
        
        var info = {
            timeStart: xiaoqu.parking_time_start,
            timeEnd: xiaoqu.parking_time_end,
            num: xiaoqu.parking_num_remain,
            type: xiaoqu.rate_type,
            price: xiaoqu.rate
        };
        
        list.push(info);

        var data = {
            cid: id,
            name: xiaoqu.name,
            addr: xiaoqu.addr_in,
            list: list
        };

        var retStr = {
            type: req.body.type,
            ret: 0,
            data: data
        };

        res.send(JSON.stringify(retStr));
        
    }) ()
}

function getAreaChewei(req, res, next) {
    var lon = parseFloat(req.body.longitude);
    var lat = parseFloat(req.body.latitude);
    var lonScope = parseFloat(req.body.lonScope);
    var latScope = parseFloat(req.body.latScope);

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

    (async () => {
        
        var xiaoqus = await Community.getXiaoquByScope(lon-lonScope, lon+lonScope, lat-latScope, lat+latScope);

        if (xiaoqus.length > 0) {
            var infos = [];
            for (var i = 0; i < xiaoqus.length; i++) {
                var info = {
                    name: xiaoqus[i].name,
                    cid: xiaoqus[i].id,
                    longitude: xiaoqus[i].longitude,
                    lantitude: xiaoqus[i].latitude,
                    num: xiaoqus[i].parking_num_remain
                };

                infos.push(info);
            }

            var retStr = {
                type: req.body.type,
                ret: 0,
                data: infos
            };

            res.send(JSON.stringify(retStr));
        }
        else {
            var retStr = {
                type: req.body.type,
                ret: 0
            };

            res.send(JSON.stringify(retStr));
        }
    }) ()
}
