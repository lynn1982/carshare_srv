
var crypto = require('crypto');
var validator = require('validator');
var eventproxy = require('eventproxy');
var authMiddleWave = require('../middleware/auth');
var User = require('../model/user');
var config = require('../config');
var smskey = require('../middleware/smskey');

var AliDayu = require('alidayu-node-sdk');
var smsClient = new AliDayu({
    app_key: 'xxxxx',
    app_secret: 'xxxxx'
});


exports.message_handle = function(req, res, next) {
    if ('MSG_TYPE_USER_SIGNUP' == req.body.type) {
        signup(req, res, next);
    }
    else if ('MSG_TYPE_USER_LOGIN' == req.body.type) {
        login(req, res, next);
    }
    else if ('MSG_TYPE_USER_LOGINOUT' == req.body.type) {
        loginout(req, res, next);
    }
    else if ('MSG_TYPE_USER_SMS_SEND' == req.body.type) {
        smsSend(req, res, next);
    }
    else if ('MSG_TYPE_USER_SMS_VERIFY' == req.body.type) {
        smsVerify(req, res, next);
    }
    else {
        next();
    }
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
            type: req.body.type,
            ret: 1,
            msg: msg
        };
        console.log('msg:'+msg);

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
                type: req.body.type,
                ret: 0,
                userId: user.id
            };

            res.send(JSON.stringify(retStr));
        }


    }) ();
    
}

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

function smsSend(req, res, next) {

    phoneNum = req.body.phoneNumber;
    console.log('phone:'+ phoneNum);

    var range = function(start, end) {
        var array = [];
        for (i=0; i<start; ++i) {
            array.push(i);
        }
        return array;
    };

    var randomstr = range(0,6).map(function(x) {
        return Math.floor(Math.random()*10);
    }).join('');

    console.log(randomstr);

    smskey.saveCode(phoneNum, randomstr);

    smsClient.smsSend({
        rec_num: phoneNum,
        sms_free_sign_name: '阿里大于的应用名',
        sms_template_code: '类型模板ID',
        sms_param: {
            number: randomstr
        }
    }).then(function(data) {
        console.log('send sms success');
        var retStr = {
            type: req.body.type,
            ret: 0  
        };
        res.send(JSON.stringify(retStr));
    }).catch(function(error) {
        console.log('send sms fail');
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: 'send sms fail'
        };
        res.send(JSON.stringify(retStr));
    });
}

function smsVerify(req, res, next) {
    
    var phoneNum = req.body.phoneNumber;
    var code = req.body.code;

    smskey.getCode(phoneNum, function(reply) {
        if (reply == code) {
            var retStr = {
                type: req.body.type,
                ret: 0
            };
            res.send(JSON.stringify(retStr));
        }
        else {
            var retStr = {
                type: req.body.type,
                ret: 1,
                msg: '验证码错误'
            };
            res.send(JSON.stringify(retStr));
        }
    });
}


