var express = require('express');
var router = express.Router();
var app = require('../control/app');
var dev = require('../control/dev');
var manage = require('../control/manage');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('main');
});

router.post('/parking_app', function(req, res, next) {
    app.message_handle(req, res);
});

router.post('/parking_dev', function(req, res, next) {
    dev.message_handle(req, res);
});

router.post('/parking_manage', function(req, res, next) {
    manage.message_handle(req, res);
});


module.exports = router;
