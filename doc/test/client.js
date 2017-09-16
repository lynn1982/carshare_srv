/** 
 * Created by Administrator on 2016/1/13. 
 */  

var mqtt  = require('mqtt');  

for(var i = 0; i<1;i++){  
    var client  = mqtt.connect('mqtt://localhost',{  
        username:'username',  
        password:'password',  
        clientId:'app_13800000000_'+i  
    });  
  
    client.on('connect', function () {
        console.log('connected.....');
        client.subscribe('#');
        client.publish('app2dev/', 'Hello mqtt');
        client.publish('car_in', '{"dev_id":123456,"xiaoqu_id":1,"chepai":"沪A-AA001"}');
        client.publish('car_in', '{"dev_id":123456,"xiaoqu_id":1,"chepai":"沪A-AA002"}');
        client.publish('car_in', '{"dev_id":123456,"xiaoqu_id":2,"chepai":"沪A-AA002"}');
        client.publish('car_in', '{"dev_id":123456,"xiaoqu_id":2,"chepai":"沪A-AA001"}');
        client.publish('car_out', '{"dev_id":123456,"xiaoqu_id":1,"chepai":"沪A-AA001"}');
        client.publish('car_out', '{"dev_id":123456,"xiaoqu_id":1,"chepai":"沪A-AA002"}');
        client.publish('car_out', '{"dev_id":123456,"xiaoqu_id":2,"chepai":"沪A-AA002"}');
        client.publish('car_out', '{"dev_id":123456,"xiaoqu_id":2,"chepai":"沪A-AA001"}');
    });  
  
    client.on('message', function (topic, message) {  
        // message is Buffer  
        console.log(message.toString());  
        //client.end();  
    });  
}
