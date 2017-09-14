var log4js = require('log4js');
log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: {
            //type: 'file',
            type: 'dateFile',
            filename: './logs/log.log',
            pattern: ".yyyy-MM-dd-hh",
            alwaysIncludePattern: true,
            compress: true
        }
    },
    categories: {
        default: { appenders: ['console'], level: 'info' },
        file: { appenders: ['file'], level: 'info' }
    }
});

levels = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL
};

exports.logger = function (name, level) {
    var logger = log4js.getLogger(name);
    //logger.setLevel(levels[level] || levels['debug']);
    return logger;
};

// 配合 express 使用的方法
exports.use = function (app, level) {
    app.use(log4js.connectLogger(log4js.getLogger('file'), {
        level: levels[level] || levels['debug'],
        format: ':method :url :status',
        nolog: '\\.gif|\\.jpg$|\\.js|\\.css'
    }));
};
