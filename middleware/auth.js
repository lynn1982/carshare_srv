
var config = require('../config');
var User = require('../model/user');
var eventproxy = require('eventproxy');

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
    var auth_token = user.id + '$$$$';
    var opts = {
        path: '/',
        signed: true,
        httpOnly: true
    };

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

        var auth = auth_token.split('$$$$');
        var user_id = auth[0];

        (async () => {
            var user = await User.getUserById(user_id);
            ep.emit('get_user', user);

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


