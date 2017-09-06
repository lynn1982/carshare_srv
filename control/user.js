
var crypto = require('crypto');
var validator = require('validator');
var eventproxy = require('eventproxy');
var authMiddleWave = require('../middleware/auth');
var User = require('../model/user');
var config = require('../config');
var smskey = require('../middleware/smskey');
var userRole = require('../middleware/role');
var Pps = require('../model/pps');
var Community = require('../model/community');

var AliDayu = require('alidayu-node-sdk');
var smsClient = new AliDayu({
    app_key: 'xxxxx',
    app_secret: 'xxxxx'
});


exports.message_handle = function(req, res, next) {
    console.log('req.body='+JSON.stringify(req.body));
    if ('MSG_TYPE_USER_SIGNUP' == req.body.type) {
        signup(req, res, next);
    }
    else if ('MSG_TYPE_USER_LOGIN' == req.body.type) {
        login(req, res, next);
    }
    else if ('MSG_TYPE_USER_LOGINOUT' == req.body.type) {
        loginout(req, res, next);
    }
    else if ('MSG_TYPE_USER_GET_VERCODE' == req.body.type) {
        smsSend(req, res, next);
    }
    else if ('MSG_TYPE_USER_SMS_VERIFY' == req.body.type) {
        smsVerify(req, res, next);
    }
    else if ('MSG_TYPE_USER_VERCODE_LOGIN' == req.body.type) {
        verLogin(req, res, next);
    }
    else if ('MSG_TYPE_USER_ADD_MGMT' == req.body.type) {
        addXiaoquMgmt(req, res, next);
    }
    else if ('MSG_TYPE_USER_GET_INFO' == req.body.type) {
        getUserInfo(req, res, next);
    }
    else if ('MSG_TYPE_USER_CHANGE_INFO' == req.body.type) {
        changeUserInfo(req, res, next);
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

    if (!validator.isNumeric(phone_num) || !validator.isLength(phone_num, 11)) {
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
        console.log('isActive:'+user.is_active+',isMgmt:'+user.is_mgmt);

        var md5 = crypto.createHash('md5');
        var pass = md5.update(passwd).digest('base64');

        if (pass != user.passwd) {
            ep.emit('login_error', '密码不正确');
            return;
        }

        if (!user.is_active && !user.role == 'super') {
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

exports.verCodeLogin = function(req, res, next) {
    var phoneNum = req.body.phoneNumber;
    var code = req.body.verCode;
    var loginType = req.body.loginType;
    var ep = new eventproxy();
    var filter = {
        phone: phoneNum
    };

    ep.fail(next);

    ep.on('err', function(msg) {
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: msg 
        };

        res.send(JSON.stringify(retStr));
    });

    if (phoneNum ==='') {
        ep.emit('err', '手机号码不能为空');
        return;
    }

    if (!validator.isNumeric(phoneNum) || !validator.isLength(phoneNum, 11)) {
        ep.emit('err', '手机号码不合法');
        return;
    }

    (async () => {
        var user = {
            role: "user",
            roleId: -1
        };
        if (loginType == "system") {
            var sys = await User.getUserByPhone(phoneNum);
            if (!sys) {
                ep.emit('err', '没有此系统管理员帐号！');
                return;
            }
            user.role = "system";
            user.roleId = sys.id;
        } else if (loginType == "changshang") {
            var pps = await Pps.getPpsByPhone(filter);
            if (!pps) {
                ep.emit('err', '没有此厂商管理员帐号！');
                return;
            }
            user.role = "changshang";
            user.roleId = pps.id;
        } else if (loginType == "xiaoqu") {
            var xiaoqu = await Community.query(filter);
            if (!xiaoqu) {
                ep.emit('err', '没有此小区管理员帐号！');
                return;
            }
            user.role = "xiaoqu";
            user.roleId = xiaoqu.id;
        } else if (loginType == "user") {
            var usr = await User.getUserByPhone(phoneNum);

            if (!usr) {
                var newUser = {
                    phone_num: phoneNum
                };

                usr = await User.newAndSave(newUser);
                if (!usr) {
                    ep.emit('err', '后台错误！');
                    return;
                }
            }
            user.role = "user";
            user.roleId = usr.id;
        } else {
            ep.emit('err', '参数错误！');
            return;
        }

        authMiddleWave.gen_session(user, res);

        var retStr = {
            ret: 0,
            role: user.role,
            roleId: user.roleId
        };

        res.send(JSON.stringify(retStr));

    }) ()

}

exports.logout = function loginout(req, res, next) {

    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {path: '/'});
    var retStr = {
        type: req.body.type,
        ret: 0
    };

    res.send(JSON.stringify(retStr));
}

function smsSend(req, res, next) {

    var phoneNum = req.body.phoneNumber;

    //for test start
    res.send(JSON.stringify({type:req.body.type,ret:0}));
    return;
    //for test end


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
    var code = req.body.verCode;
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

    smskey.getCode(phoneNum, function(reply) {
        if (reply.toString() === code.toString()) {
            var retStr = {
                type: req.body.type,
                ret: 0
            };
            res.send(JSON.stringify(retStr));

            User.getUserById(req.session.user.id).then((user) => {
                if (!user) {
                    ep.emit('err', '数据库错误');
                    return;
                }

                User.setUserActive(user);
            });
        }
        else {
            
            ep.emit('err', '验证码错误');
        }
    });
}

function verLogin(req, res, next) {

    var phoneNum = req.body.phoneNumber;
    var code = req.body.verCode;
    var uid;
    var role;
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

    if (phoneNum ==='') {
        ep.emit('err', '手机号码不能为空');
        return;
    }

    if (!validator.isNumeric(phoneNum) || !validator.isLength(phoneNum, 11)) {
        ep.emit('err', '手机号码不合法');
        return;
    }

    (async () => {
        var user = await User.getUserByPhone(phoneNum);

        /*if (user && user.is_active) {
            ep.emit('err', '用户已存在');
            return;
        }*/

        //get vercode from redis and compare
        //suppose the result is correct, then do
        //

        if (user) {

            //await User.setUserActive(user);
            uid = user.id;
            role = user.role;
            authMiddleWave.gen_session(user, res);

        }
        else {
            var newUser = {
                phone_num: phoneNum,
                //is_active: true
            };

            var newuser = await User.newAndSave(newUser);
            uid = newuser.id;
            role = newuser.role;
            authMiddleWave.gen_session(newuser, res);

        }

        var retStr = {
            type: req.body.type,
            ret: 0,
            uid: uid,
            role: userRole.getUserRole(role)
        };

        res.send(JSON.stringify(retStr));

    }) ()

}

function addXiaoquMgmt(req, res, next) {
    var phone = req.body.phoneNumber;
    var passwd = req.body.passwd; 

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

    if (!validator.isNumeric(phone) || !validator.isLength(phone, 11)) {
        ep.emit('prop_err', '手机号码不合法');
        return;
    }

    (async () => {
        var user = await User.getUserByPhone(phone);
         
        if (user) {
            ep.emit('prop_err', '手机号码已被使用');
            return;
        }

        var md5 = crypto.createHash('md5');
        var pass = md5.update(passwd).digest('base64');

        var newUser = {
            passwd: pass,
            phone_num: phone,
            is_mgmt: true,
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
                uid: user.id
            };

            res.send(JSON.stringify(retStr));
        }


    }) ();

}

function getUserInfo(req, res, next) {

    var id = req.body.uid;
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
        var user = await User.getUserById(id);
        if (!user) {
            ep.emit('err', '用户不存在');
            return;
        }

        var retStr = {
            type: req.body.type,
            ret: 0,
            name: user.login_name,
            phone: user.phone_num,
            sex: user.sex,
            chepai: user.car_license
        };

        res.send(JSON.stringify(retStr));
    }) ()
}

function changeUserInfo(req, res, next) {

    var id = req.body.uid;

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
        var user = await User.getUserById(id);
        if (!user) {
            ep.emit('err', '用户不存在');
            return;
        }

        var newUser = {
            login_name: req.body.name,
            sex: req.body.sex,
            car_license: req.body.chepai,
            phone_num: req.body.phone
        };

        await User.updateUser(user, newUser);

        res.send(JSON.stringify({type: req.body.type, ret: 0}));

    }) ()
}
