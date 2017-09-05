
var Pps = require('../model/pps');
var eventproxy = require('eventproxy');
var User = require('../model/user');
var validator = require('validator');

exports.message_handle = function(req, res, next) {
    console.log('pps_req='+JSON.stringify(req.body));
    var msgType = req.body.type;

    if ('MSG_T_MGMT_QUERY_PPS' == msgType) {
        queryPps(req, res, next);
    }
    else if ('MSG_T_MGMT_NEW_PPS' == msgType) {
        addPps(req, res, next);
    }
    else if ('MSG_T_MGMT_UPDATE_PPS' == msgType) {
        updatePps(req, res, next);
    }
    else if ('MSG_T_MGMT_DEL_PPS' == msgType) {
        delPps(req, res, next);
    }
    else {
        next();
    }
};


function addPps(req, res, next) {

    var name = req.body.name;
    var phone = req.body.phone;
    var contacts = req.body.contacts;
    var email = req.body.email;
    var parkNum = req.body.parkNum;

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

    if ([name, phone].some(function(item) {return item === '';})) {
        ep.emit('err', '信息不完整');
        return;
    }

    if (!validator.isNumeric(phone) || !validator.isLength(phone, 11)) {
        ep.emit('prop_err', '手机号码不合法');
        return;
    }

    (async() => {
        var user_id;

        var user = await User.getUserByPhone(phone);
        if (user) {
            user_id = user.id;
        }
        else {
            var newUser = {
                login_name: contacts,
                phone_num: phone,
                email: email,
                role: 'pps'
            };

            var newuser = await User.newAndSave(newUser);
            user_id = newuser.id;
        }

        var newPps = {
            name: name,
            parkNum: parkNum,
            user_id: user_id
        };

        var pps = await Pps.newAndSave(newPps);
        if (!pps) {
            ep.emit('err', '数据库错误');
            return;
        }

        var retStr = {
            type: req.body.type,
            ret: 0,
            id: pps.id
        };

        res.send(JSON.stringify(retStr));

    }) ()

}

function queryPps(req, res, next) {

    var name = req.body.name;
    var list = [];

    (async () => {
        var ppss;

        if (typeof(name) == "undefined") {
            ppss = await Pps.queryAllPps();
        } else {
            ppss = await Pps.queryPps(name);
        }

        if (ppss.length > 0) {
            for (var i in ppss) {
                var user = await User.getUserById(ppss[i].user_id);
                var regdate = ppss[i].createdAt;

                if (user) {
                    var info = {
                        id: ppss[i].id,
                        name: ppss[i].name,
                        parkNum: ppss[i].parkNum,
                        regDate: regdate.getFullYear()+'-'+regdate.getMonth()+'-'+regdate.getDate(),
                        phone: user.phone_num,
                        contacts: user.login_name,
                        email: user.email
                    };
                }
                else {
                    var info = {
                        id: ppss[i].id,
                        parkNum: ppss[i].parkNum
                    };
                }

                list.push(info);
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

function updatePps(req, res, next) {
    
    var id = req.body.id;
    var phone = req.body.phone;
    var uid;

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

    (async() => {
        var pps = await Pps.getPpsById(id);
        if (!pps) {
            ep.emit('err', '设备厂商id错误');
            return;
        }
        
        uid = pps.user_id;
        var user = await User.getUserById(uid);

        if (user.phone_num != phone) {
            var s_user = await User.getUserByPhone(phone);
            if (s_user) {
                uid = s_user.id;
            } 
            else {
                var newUser = {
                    phone_num: phone,
                    login_name: req.body.contacts,
                    email: req.body.email,
                    role: 'pps'
                };

                var newuser = await User.newAndSave(newUser);
                uid = newuser.id;
            }
        }

        var newPps = {
            name: req.body.name,
            parkNum: req.body.parkNum,
            user_id: uid
        };

        Pps.updatePps(pps, newPps);

        var retStr = {
            type: req.body.type,
            ret: 0
        };

        res.send(JSON.stringify(retStr));
    }) ()
}

function delPps(req, res, next) {

    var id = req.body.id;

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


    (async() => {
        var pps = await Pps.getPpsById(id);
        if (!pps) {
            ep.emit('err', '设备厂商不存在');
            return;
        }

        Pps.deletePps(pps);

        var retStr = {
            type: req.body.type,
            ret: 0
        };

        res.send(JSON.stringify(retStr));
    }) ()
}
