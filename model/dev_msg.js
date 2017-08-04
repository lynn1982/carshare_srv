function message_handle(packet){
    var topic = packet.topic;
    var payload = packet.payload;

    console.log("topic="+topic+",payload="+payload.toString());
    if (topic == 'car_in') {
        /* {"dev_id":123456,"xiaoqu_id":000001,"chepai":"沪A-AA001"} */
    } 
    else if (topic == 'car_out') {
    }
}
module.exports.message_handle = message_handle;
