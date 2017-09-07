
var config = require('../config');
var User = require('../model/user');
var eventproxy = require('eventproxy');
var Pps = require('../model/pps');
var Community = require('../model/community');

exports.userRequired = function(req, res, next) {
    if (!req.session || !req.session.user) {
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: '请登录后操作'
        };

        res.send(JSON.stringify(retStr));
        //return res.status(403).send('forbidden!');
    }

    next();
};

exports.mgmtRequired = function(req, res, next) {
    if (!req.session.user) {
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: '请登录后操作'
        };

        res.send(JSON.stringify(retStr));
    }
    else if (!req.session.user.is_mgmt) {
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: '需要管理员权限'
        };

        res.send(JSON.stringify(retStr));
    }
    else {
        next();
    }
};

exports.gen_session = function(user, res) {
    var auth_token = user.role + '$$$$' + user.roleId;
    var opts = {
        path: '/',
        signed: true,
        httpOnly: true
    };

    console.log("gen_session() auth_token="+auth_token);

    res.cookie(config.auth_cookie_name, auth_token, opts);
};

exports.authUser = function(req, res, next) {
    var ep = new eventproxy();
    ep.fail(next);

    ep.all('get_user', function(user) {
        if (!user) {
            return next();
        }

        req.session.user = user;

        console.log(req.session);

        return next();
    });

    if (req.session.user) {
        ep.emit('get_user', req.session.user);
    }
    else {
        var auth_token = req.signedCookies[config.auth_cookie_name];
        if (!auth_token) {
            return next();
        }
        console.log('auth token:'+auth_token);

        var auth = auth_token.split('$$$$');
        var userRole = auth[0];
        var userRoleId = auth[1];
        var newUser = {
            role: userRole,
            id: userRoleId
        };

        (async () => {
            var user = null;
            if (userRole == "system" || userRole == "user") {
                user = await User.getUserById(userRoleId);
            } else if (userRole == "changshang") {
                user = await Pps.getPpsById(userRoleId);
            } else if (userRole == "xiaoqu") {
                user = await Community.getXiaoquById(userRoleId);
            }
            if (user) {
                ep.emit('get_user', newUser);
            } else {
                ep.emit('get_user', user);
            }

        }) ()
    }
};

exports.getUser = function(req, res, next) {

    var uid = req.body.uid;
    var ep = new eventproxy();
    ep.fail(next);

    ep.on('err', function(msg) {
        var retStr = {
            type: req.body.type,
            ret: 1,
            msg: msg
        };
    });

    if (!uid) {
        ep.emit('err', '用户id不能为空');
        return;
    }

    (async () => {
        var user = await User.getUserById(uid);
        if (!user) {
            ep.emit('err', '用户id错误');
            return;
        }

        req.session.user = user;

        return next();

    }) ()
};


