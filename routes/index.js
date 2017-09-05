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
var userRole = require('../middleware/role');


/* GET home page. */
router.get('/', function(req, res, next) {

    if (!req.session || !req.session.user) {
        res.render('loginWithPhonen', {title: '共享车位'});
        return;
    }

    var role = userRole.getUserRole(req.session.user.role);

    console.log('----role----:'+role);
    switch(role)
    {
        case userRole.ur_system:
            res.render('main_admin', {title: '共享车位'});
            break;
        case userRole.ur_changshang:
            res.render('main_changshang', {title: '共享车位'}); 
            break;
        case userRole.ur_xiaoqu:
            res.render('main_xiaoqu', {title: '共享车位'}); 
            break;
        case userRole.ur_user:
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
