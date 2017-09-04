var express = require('express');
var router = express.Router();
var user = require('../control/user');
var park = require('../control/parking');
var auth = require('../middleware/auth');
var xiaoqu = require('../control/xiaoqu');
var config = require('../config');
var crypto = require('crypto');
var User = require('../model/user');
var pps = require('../control/pps');

var UserRole = {
    ur_unlogin: 0, 
    ul_user: 1,
    ur_changshang: 2, 
    ur_xiaoqu: 3, 
    ur_system: 4 
};

function getUserRole(req) {
    if (!req.session || !req.session.user) {
        return UserRole.ur_unlogin;
    }

    /* TODO: get user role from session info */
    return UserRole.ur_system;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    var userRole = getUserRole(req);
    switch(userRole)
    {
        case UserRole.ur_system:
            res.render('main_admin', {title: '共享车位'});
            break;
        case UserRole.ur_changshang:
            res.render('main_changshang', {title: '共享车位'}); 
            break;
        case UserRole.ur_xiaoqu:
            res.render('main_xiaoqu', {title: '共享车位'}); 
            break;
        case UserRole.ur_user:
            res.render('main_user', {title: '共享车位'}); 
            break;
        default:
            res.render('loginWithPhonen', {title: '共享车位'});
    }
});


router.post('/user', user.message_handle);
router.post('/parking', auth.userRequired, park.message_handle);
router.post('/xiaoqu', auth.userRequired, xiaoqu.message_handle);
router.post('/pps', auth.userRequired, pps.message_handle);

router.get('/create_admin', function(req, res, next) {

    (async() => {
        var user = await User.getUserByName(config.admin);

        if (user) {
            User.deleteUser(user);
        }
        
        var md5 = crypto.createHash('md5');
        var pass = md5.update(config.admin_passwd).digest('base64');
        var admin = {
            login_name: config.admin,
            passwd: pass,
            role: 'super'
        };

        User.newAndSave(admin);
    
        res.redirect('/');
    }) ()
});

module.exports = router;
