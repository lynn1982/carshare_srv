
var redis = require('redis');
var client = redis.createClient();
var expireTime = 1*60;

client.on('error', function(err) {
    console.log('redis error: ' + err);
});

function saveCode(key, value) {
    client.set(key, value);
    client.expire(key, expireTime);
}

function getCode(key, callback) {
    client.get(key, function(err, reply) {
        if (err) {
            console.log(err.stack);
        }
        callback(reply);
    });
}

exports.saveCode = saveCode;
exports.getCode = getCode;
