
var Parking = require('../model/parking');
var User = require('../model/user');
var Order = require('../model/transaction');
var crypto = require('crypto');
var validator = require('validator');
var eventproxy = require('eventproxy');
var authMiddleWave = require('../middleware/auth');
var config = require('../config');



function message_handle(req, res, next) {

    if ('MSG_TYPE_PARKING_PUBLISH' == req.body.type) {
        publish(req, res, next);
    }
    else if ('MSG_TYPE_PARKING_PUBLISH_MODIFY' == req.body.type) {
        publish_modify(req, res, next);
    }
    else if ('MSG_TYPE_PARKING_PUBLISH_CANCEL' == req.body.type) {
        publish_cancel(req, res, next);
    }
    else if ('MSG_TYPE_PARKING_ORDER' == req.body.type) {
        order(req, res, next);
    }
    else if ('MSG_TYPE_PARKING_ORDER_CANCEL' == req.body.type) {
        order_cancel(req, res, next);
    }
    else if ('MSG_TYPE_SIGNUP' == req.body.type) {
        signup(req, res, next);
    }
    else if ('MSG_TYPE_LOGIN_PHONE' == req.body.type) {
        login(req, res, next);
    }
    else if ('MSG_TYPE_LOGIN_OUT' == req.body.type) {
        loginout(req, res, next);
    }
    else {
        next();
    }

}

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
            type: 'MSG_TYPE_PARKING_PUBLISH',
            ret: 0,
            id: data.id
        };

        console.log(JSON.stringify(retStr)); 

        res.send(JSON.stringify(retStr));
    });
}

function publish_modify(req, res, next) {

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

function publish_cancel(req, res, next) {

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

function order_cancel(req, res, next) {
    
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

};

function signup(req, res, next) {
    var login_name = validator.trim(req.body.loginName);
    var phone_num = req.body.phoneNumber;
    var passwd = validator.trim(req.body.passwd);
    var repass = validator.trim(req.body.rePasswd);

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('prop_err', function(msg) {
        var retStr = {
            type: 'MSG_TYPE_SIGNUP',
            ret: 1,
            msg: msg
        };

        res.send(JSON.stringify(retStr));
    });

    if ([login_name, phone_num, passwd, repass].some(function(item) {return item === '';})) {
        ep.emit('prop_err', '信息不完整');
        return;
    }

    if (login_name.length < 6) {
        ep.emit('prop_err', '用户名至少需要6个字符');
        return;
    }

    if (!validator.isNumeric(phone_num)) {
        ep.emit('prop_err', '手机号码不合法');
        return;
    }

    if (passwd != repass) {
        ep.emit('prop_err', '两次密码输入不一致');
        return;
    }

    (async () => {
        var users = await User.getUsersByQuery({'$or':[
            {'login_name': login_name},
            {'phone_num': phone_num}
        ]});

        if (users.length > 0) {
            ep.emit('prop_err', '用户名或者手机号码已被使用');
            return;
        }

        var md5 = crypto.createHash('md5');
        var pass = md5.update(passwd).digest('base64');

        var newUser = {
            login_name: login_name,
            passwd: pass,
            phone_num: phone_num
        };

        var user = await User.newAndSave(newUser);

        if (!user) {
            ep.emit('prop_err', '数据库错误');
            return;
        }
        else {
            var retStr = {
                type: 'MSG_TYPE_SIGNUP',
                ret: 0,
                userId: user.id
            };

            res.send(JSON.stringify(retStr));
        }


    }) ();
    
};

function login(req, res, next) {

    var loginname = req.body.loginId;
    var passwd = req.body.passwd;
    var ep = new eventproxy();

    ep.fail(next);

    ep.on('login_error', function(msg) {
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: msg 
        };

        res.send(JSON.stringify(retStr));
    });

    if (!loginname || !passwd) {
        ep.emit('login_error', '信息不完整');
        return;
    }

    var getUser;

    if (validator.isNumeric(loginname) && (loginname.length == 11)) {
        getUser = User.getUserByPhone;
    }
    else {
        getUser = User.getUserByName;
    }

    getUser(loginname).then((user) => {
        if (!user) {
            ep.emit('login_error', '用户不存在');
            return;
        }

        var md5 = crypto.createHash('md5');
        var pass = md5.update(passwd).digest('base64');

        if (pass != user.passwd) {
            ep.emit('login_error', '密码不正确');
            return;
        }

        if (!user.is_active) {
            ep.emit('login_error', '此用户还没有激活');
            return;
        }

        //req.session.user = user;
        authMiddleWave.gen_session(user, res);

        var retStr = {
            type: req.body.type,
            ret: 0,
            id: user.id
        };

        res.send(JSON.stringify(retStr));
    });
}


function loginout(req, res, next) {

    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {path: '/'});
    var retStr = {
        type: req.body.type,
        ret: 0
    };

    res.send(JSON.stringify(retStr));
}

module.exports.message_handle = message_handle;
