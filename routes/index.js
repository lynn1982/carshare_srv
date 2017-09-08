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
var dev = require('../control/dev');


/* GET home page. */
router.get('/', function(req, res, next) {

    if (!req.session || !req.session.user) {
        res.render('loginWithPhonen', {title: '共享车位'});
        return;
    }

    //console.log(JSON.stringify(req.session.user));

    switch(req.session.user.role)
    {
        case "system":
            res.render('main_admin', {title: '共享车位'});
            break;
        case "changshang":
            res.render('main_changshang', {title: '共享车位'}); 
            break;
        case "xiaoqu":
            res.render('main_xiaoqu', {title: '共享车位'}); 
            break;
        case "user":
            res.render('main_user', {title: '共享车位'}); 
            break;
        default:
            res.render('loginWithPhonen', {title: '共享车位'});
    };
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
            phone_num: config.phone_num,
            role: 'system'
        };

        User.newAndSave(admin);
    
        res.redirect('/');
    }) ()
});

/* RESTful api start */
router.post('/user/vcLogin', user.verCodeLogin);
router.get('/user/logout', auth.userRequired, user.logout);

router.post('/pps_new', auth.userRequired, pps.add);
router.get('/pps', auth.userRequired, pps.get);
router.get('/pps/:id', auth.userRequired, pps.getone);
router.put('/pps/:id', auth.userRequired, pps.update);
router.delete('/pps/:id', auth.userRequired, pps.delete);

router.post('/xiaoqu_new', auth.userRequired, xiaoqu.add);
router.get('/xiaoqu', auth.userRequired, xiaoqu.get);
router.get('/xiaoqu/:id', auth.userRequired, xiaoqu.getone);
router.put('/xiaoqu/:id', auth.userRequired, xiaoqu.update);
router.delete('/xiaoqu/:id', auth.userRequired, xiaoqu.delete);

router.get('/parking/bill', auth.userRequired, park.getBill);

router.post('/dev', dev.add);

module.exports = router;
