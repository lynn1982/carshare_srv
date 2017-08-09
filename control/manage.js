

function message_handle(req, res) {
    console.log("req="+JSON.stringify(req.body));
    var msgType = req.body.type;
    var retStr = {
        type: msgType,
        ret: 0
    };


    if ('MSG_T_MGMT_NEW_XIAOQU' == msgType) { 
        res.send(JSON.stringify(retStr));
    } else if ('MSG_T_MGMT_QUERY_XIAOQU' == msgType) {
        res.send(JSON.stringify(retStr));
    } else if ('MSG_T_MGMT_UPDATE_XIAOQU' == msgType) {
        res.send(JSON.stringify(retStr));
    }
}


module.exports.message_handle = message_handle;
