const logger = require('../lib/logger').logger('file');

exports.reply = function(req, res, ret) {
    logger.info("req.path="+req.path+",ret="+JSON.stringify(ret));
    res.send(JSON.stringify(ret));
}
