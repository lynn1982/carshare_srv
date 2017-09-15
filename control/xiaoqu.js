
var Community = require('../model/community');
var Parking = require('../model/parking');
var eventproxy = require('eventproxy');
var Dev = require('../model/dev');
const logger = require('../lib/logger').logger('file');
const moment = require('moment');

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
    else if ('MSG_T_MGMT_CAR_STAT' == msgType) {
        getCarStat(req, res, next);
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
        //pps_id: req.body.pps_id,
        phone: req.body.phone,
        contacts: req.body.contacts,
        email: req.body.email,

        parking_num_total: req.body.parking_num_total,
        parking_time_start: req.body.parking_time_start,
        parking_time_end: req.body.parking_time_end,
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
            //pps_id: req.body.pps_id,
            phone: req.body.phone,
            contacts: req.body.contacts,
            email: req.body.email,

            parking_num_total: req.body.parking_num_total,
            parking_num_share: req.body.parking_num_share,
            parking_num_remain: req.body.parking_num_remain,
            parking_time_start: req.body.parking_time_start,
            parking_time_end: req.body.parking_time_end,
            rate_type: req.body.rate_type,
            rate: req.body.rate
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

exports.searchResult = function (req, res, next) {
    var retStr = {
        ret: 0
    };

    var info = req.body;
    info. uid = req.session.user.id;
    logger.info('search result: '+JSON.stringify(info));
    res.send(JSON.stringify(retStr));
}

exports.getXiaoquChewei = function getXiaoquInfo(req, res, next) {
    var id = req.params.id;
    var list = [];

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('err', function(msg) {
        var retStr = {
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

        var c_resId = 'c_' + id;
        
        var c_info = {
            resId: c_resId,
            timeStart: xiaoqu.parking_time_start.substr(0,5),
            timeEnd: xiaoqu.parking_time_end.substr(0,5),
            num: xiaoqu.parking_num_remain,
            type: xiaoqu.rate_type,
            price: xiaoqu.rate
        };
        
        list.push(c_info);

        var parkings = await Parking.getInfoByCommunityId(id);
        if (parkings.length > 0) {
            for (var i in parkings) {
                p_resId = 'p_' + parkings[i].id;
                var p_info = {
                    resId: p_resId,
                    timeStart: parkings[i].parking_time_start.substr(0,5),
                    timeEnd: parkings[i].parking_time_end.substr(0,5),
                    num: 1,
                    type: parkings[i].rate_type,
                    price: parkings[i].rate
                };

                list.push(p_info);
            }
        }

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

function getCarStat(req, res, next) {
    var cname = req.body.cname;
    var chepai = req.body.chepai;
    var data = [];

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('err', function(msg) {
        var retStr = {
            ret: msg.ret,
            msg: msg.str
        };

        res.send(JSON.stringify(retStr));
    });

    var filter = {};

    if (typeof(cname) != 'undefined') {
        filter.xqname = cname;
    }
    if (typeof(chepai) != 'undefined') {
        filter.chepai = chepai;
    }

    (async() => {
        var devs = await Dev.query(filter);
        if (!devs) {
            ep.emit('err', {ret:8001, str:'No Data!'});
            return;
        }

        for (var i in devs) {
            var list = {
                chepai: devs[i].chepai,
                xqname: devs[i].xqname,
                in_time: moment(devs[i].in_time).format('MM-DD HH:mm'),
                out_time: moment(devs[i].out_time).format('MM-DD HH:mm'),
            }
            data.push(list);
        }

        var retStr = {
            type: req.body.type,
            ret: 0,
            data: data
        };

        res.send(JSON.stringify(retStr));

    }) ()
 
}

exports.getAreaChewei = function getAreaChewei(req, res, next) {
    var filter = JSON.parse(req.query.filter);
    /*var lon = parseFloat(req.body.longitude);
    var lat = parseFloat(req.body.latitude);
    var lonScope = parseFloat(req.body.lonScope);
    var latScope = parseFloat(req.body.latScope);*/
    var lon = filter.longitude;
    var lat = filter.latitude;
    var lonScope = filter.lonScope;
    var latScope = filter.latScope;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('err', function(msg) {
        var retStr = {
            ret: msg.ret,
            msg: msg.str
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
                ret: 0,
                data: infos
            };

            res.send(JSON.stringify(retStr));
        }
        else {
            ep.emit('err', {ret:8001, str:'No Data!'});
            return;
        }
    }) ()
}


exports.add = function(req, res, next) {
    var pps_id = req.body.pps_id;
    var name = req.body.name;
    var addr_in = req.body.addr_in;
    var u_role = req.session.user.role;

    if (u_role == 'system') {
        pps_id = 0;
    }

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('err', function(msg) {
        var retStr = {
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
        //mgmt_id: req.session.user.id,
        name: name,
        city: req.body.city,
        district: req.body.district,
        addr_in: addr_in,
        addr_out: req.body.addr_out,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        pps_id: pps_id,
        phone: req.body.phone,
        contacts: req.body.contacts,
        email: req.body.email,
    };

    (async () => {
        var xiaoqu = await Community.newAndSave(newXiaoqu);

        if (!xiaoqu) {
            ep.emit('err', '数据库错误');
            return;
        }
        else {
            var retStr = {
                ret: 0,
                cid: xiaoqu.id
            };

            res.send(JSON.stringify(retStr));
        }

    }) ()
   
};

exports.get = function(req, res, next) {
    var list = [];
    var filter = JSON.parse(req.query.filter);

    var ep = new eventproxy();

    ep.fail(next);
    ep.on('err', function(msg) {
        var retStr = {
            ret: 1,
            msg: msg
        };

        res.send(JSON.stringify(retStr));
    });

    (async () => {
        var xiaoqus = await Community.query(filter);

        if (xiaoqus.length > 0) {
            for (var i =0; i < xiaoqus.length; i++) {
                list.push(xiaoqus[i]);
            }
        }

        var retStr = {
            ret: 0,
            data: list
        };

        res.send(JSON.stringify(retStr));

    }) ()
};

exports.getone = function(req, res, next) {
    var id = req.params.id;
    var ep = new eventproxy();

    ep.fail(next);
    ep.on('err', function(msg) {
        var retStr = {
            ret: 1,
            msg: msg
        };

        res.send(JSON.stringify(retStr));
    });

    (async () => {
        var xiaoqu = await Community.getXiaoquById(id);

        var retStr = {
            ret: 0,
            data: xiaoqu
        };

        res.send(JSON.stringify(retStr));

    }) ()
};

exports.update = function(req, res, next) {
    var id = req.params.id;

    var ep = new eventproxy();

    ep.fail(next);
    ep.on('err', function(msg) {
        var retStr = {
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
            //pps_id: req.body.pps_id,
            phone: req.body.phone,
            contacts: req.body.contacts,
            email: req.body.email,

            parking_num_total: req.body.parking_num_total,
            parking_num_share: req.body.parking_num_share,
            parking_num_remain: req.body.parking_num_remain,
            parking_time_start: req.body.parking_time_start,
            parking_time_end: req.body.parking_time_end,
            rate_type: req.body.rate_type,
            rate: req.body.rate
        };

        Community.updateXiaoqu(xiaoqu, newXiaoqu);

        var retStr = {
            ret: 0,
        };

        res.send(JSON.stringify(retStr));

    }) ()
   
};

exports.delete = function(req, res, next) {
    var id = req.params.id;

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('err', function(msg) {
        var retStr = {
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
            ret: 0
        };

        res.send(JSON.stringify(retStr));

    }) ()


};

// /xiaoqu/namelist
exports.getNameList = function(req, res, next) {
    var filter = JSON.parse(req.query.filter);
    var list = [];
    var ep = new eventproxy();

    ep.fail(next);
    ep.on('err', function(msg) {
        var retStr = {
            ret: msg.ret,
            msg: msg,str
        };

        res.send(JSON.stringify(retStr));
    });

    if(req.session.user.role != 'system') {
        ep.on('err', {ret: 8003, str: "无权限!"});
        return;
    }

    (async() => {
        var xqs;

        xqs = await Community.query(filter);

        if (xqs.length > 0) {
            for (var i =0; i < xqs.length; i++) {
                list.push({ 
                    id:xqs[i].id,
                    name:xqs[i].name
                });
            }
        }

        var retStr = {
            ret: 0,
            data: list
        };

        res.send(JSON.stringify(retStr));
    }) ()
}

exports.updateCheweiCount = function(cid, count, add) {

    (async() => {
        var xiaoqu = await Community.getXiaoquById(cid);
        if (!xiaoqu) {
            return;
        }

        var remain = xiaoqu.parking_num_remain;
        if (add) {
            remain += count;
        }
        else {
            remain -= count;
        }

        var update = {
            parking_num_remain: remain
        };

        Community.updateXiaoqu(xiaoqu, update);
    }) ()
};
