var express = require('express');
var router = express.Router();
var user = require('../control/user');
var park = require('../control/parking');
var auth = require('../middleware/auth');
var xiaoqu = require('../control/xiaoqu');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('main');
});


router.post('/user', user.message_handle);
router.post('/parking', auth.userRequired, park.message_handle);
router.post('/xiaoqu', auth.mgmtRequired, xiaoqu.message_handle);

module.exports = router;
