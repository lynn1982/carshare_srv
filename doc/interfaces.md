## 目录
* [后台管理接口](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#1-后台管理接口)
   * [小区信息登录](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#11-小区信息登录)
      * [新增小区](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#111-新增小区)
      * [查询小区信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#112-查询小区信息)
      * [更新小区信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#113-更新小区信息)
* [后台与APP接口](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#2-后台与app接口)
    * [用户注册与登录](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#21-用户注册与登录)
        * [获取手机验证码](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#211-获取手机验证码)
        * [手机验证码登陆](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#212-手机验证码登陆)
        * [获取用户信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#213-获取用户信息)
        * [修改用户信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#214-修改用户信息)
    * [车位查询](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#22-车位查询)
        * [获取周边车位信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#221-获取周边车位信息)
        * [获取小区车位信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#221-获取小区车位信息)
    * [车位预定](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#23-预定车位)
        * [预定车位(pre-pay)](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#231-预定车位pre-pay)
        * [预定车位(post-pay)](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#232-预定车位post-pay)
        * [获取我的预定](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#233-获取我的预定)
        * [取消车位预定](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#234-取消车位预定)

## 1. 后台管理接口

消息枚举定义：

    enum{
        MSG_T_MGMT_NEW_XIAOQU,
        MSG_T_MGMT_QUERY_XIAOQU,
        MSG_T_MGMT_UPDATE_XIAOQU，
        MSG_TYPE_LOGIN_OUT，
        MSG_TYPE_LOGIN_PHONE_UNBIND，
        MSG_TYPE_PARKING_PUT,
    }；

### 1.1 小区管理员登录

|METHOD|PATH|
|------|----|
|POST|/user|

上报报文

    {
        type: MSG_TYPE_USER_ADD_MGMT,
        phoneNumber:"18913425678"，
        passwd:"111111"，
    }
    
回复报文

    {
        type: MSG_TYPE_USER_ADD_MGMT,
        ret: 0,
        uid: 2
    }

### 1.2 小区信息登录

|METHOD|PATH|
|------|----|
|POST|/xiaoqu|

#### 1.2.1 新增小区
上报报文

    {
        type: MSG_T_MGMT_NEW_XIAOQU,
        city:"上海"，
        district:"浦东"，
        name:"凤凰花园"，
        //addr:"上海市浦东新区机场东路888号"，
        addr_in:"上海市浦东新区机场东路888号"，
        addr_out:"上海市浦东新区机场东路888号",
        longitude: "233.121",
        latitude: "110.432",
        pps_id: "2",
        parking_num_total: "200",
        timeStart: "10:00",
        timeEnd: "18:00",
        rate_type: "time",
        rate: "10"
    }
    
回复报文

    {
        type: MSG_T_MGMT_NEW_XIAOQU,
        ret: 0, // 0:成功，非0:失败原因
        cid: 2,
        msg:"重复添加"  //非0:失败原因
    }

#### 1.2.2 查询小区信息
上报报文

    {
        type: MSG_T_MGMT_QUERY_XIAOQU,
        city:"上海"，
        district:"浦东"，
        name:"凤凰花园"，
    }
    
回复报文

    {
        type: MSG_T_MGMT_QUERY_XIAOQU,
        ret: 0,
        data: [
            {}, //小区1的信息
            {}, //小区2的信息
            {}  //小区3的信息        ]
        ]
    }

#### 1.2.3 更新小区信息
上报报文

    {
        type: MSG_T_MGMT_UPDATE_XIAOQU,
        cid: '1'，
        //以下非必须
        addr_in:"上海市松江区机场东路888号",
        addr_out: "上海市松江区机场东路888号",
        city: "上海",
        district: '浦东',
        longitude: '221.342',
        latitude: '551.733',
        parking_num_total: '200',
        timeStart: '10:00',
        timeEnd: '19:00',
        rateType: 'time',
        price: '10'
    }
    
回复报文

    {
        type: MSG_T_MGMT_UPDATE_XIAOQU,
        ret: 0, // 0:成功，非0:失败原因
        msg:"重复添加"，
    } 
      
### 1.3 小区发布共享车位信息

|METHOD|PATH|
|------|----|
|POST|/xiaoqu|


上报报文

    {
        type: MSG_T_MGMT_PUBLISH_XIAOQU,
        cid: '1'，
    }
    
回复报文

    {
        type: MSG_T_MGMT_PUBLISH_XIAOQU,
        ret: 0
    } 
    
### 1.4 统计信息
#### 1.4.1 住宅小区日常车辆进出统计
上报报文

    {
        type: MSG_TYPE_PARKING_MANAGE_CAR_STAT,
        cid: '1'，
        dateStart: '2017-02-15',
        dateEnd: '2017-02-25'
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_MANAGE_CAR_STAT,
        cid: '1',    //返回小区id号
        ret: 0,
        data: [
           {
              date: '2017-02-15',
              0_7_in: '10',
              0_7_out: '20',
              ....
           },
           .....
           {  date: '2017-02-25',
              0_7_in: '22',
              0_7_out: '11'
           }
        ]
    }
    
#### 5.3.2 住宅小区共享车位使用统计
上报报文

    {
        type: MSG_TYPE_PARKING_MANAGE_SHARE_STAT,
        community: '1'，
        dateStart: '2017-02-15',
        dateEnd: '2017-02-25'
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_MANAGE_SHARE_STAT,
        community: '1',    //返回小区id号
        ret: 0,
        data: [
           {
              date: '2017-02-15',
              count: '10',
           },
           .....
           {  date: '2017-02-25',
              count: '22',
           }
        ]
    }
    
#### 5.3.3 小区收益统计
上报报文

    {
        type: MSG_TYPE_PARKING_MANAGE_INCOME_STAT,
        community: '1'，
        dateStart: '2017-02-15',
        dateEnd: '2017-02-25'
    }

## 2. 后台与APP接口

### 2.1 用户注册与登录

|METHOD|PATH|MSG TYPE|
|:----:|:-----:|:----|
|POST|/user|MSG_TYPE_USER_GET_VERCODE<br>MSG_TYPE_USER_VERCODE_LOGIN<br>MSG_TYPE_USER_GET_INFO<br>MSG_TYPE_USER_CHANGE_INFO|


#### 2.1.1 获取手机验证码

上报报文

    {
        type: MSG_TYPE_USER_GET_VERCODE,
        phoneNumber: '18925617845'
    }
    
回复报文

    {
        type: MSG_TYPE_USER_GET_VERCODE,
        ret：0
    }

#### 2.1.2 手机验证码登陆

上报报文

    {
        type: MSG_TYPE_USER_VERCODE_LOGIN,
        phoneNumber: '18925617845',
        verCode: '1234'
    }
    
回复报文

    {
        type: MSG_TYPE_USER_VERCODE_LOGIN,
        ret：0
    }


#### 2.1.3 获取用户信息

上报报文
```
    {
        type: "MSG_TYPE_USER_GET_INFO",
        uid: '1', //是uid,还是accesstoken?
    }
```
    
回复报文
```
    {
        type: "MSG_TYPE_USER_CHANGE_INFO",
        ret：0,
        name: "黎明", //以下字段为可选字段
        sex: "male",//or "female"
        chepai: "沪A-00001"
    }
```

#### 2.1.4 修改用户信息

上报报文
```
    {
        type: "MSG_TYPE_USER_CHANGE_INFO",
        uid: '1', //是uid,还是accesstoken?
        name: "黎明", //以下字段为可选字段
        sex: "male",//or "female"
        chepai: "沪A-00001",
        phone: "18616996666"
    }
```
    
回复报文
```
    {
        type: "MSG_TYPE_USER_CHANGE_INFO",
        ret：0
    }
```

### 2.2 车位查询

|METHOD|PATH|MSG TYPE|
|------|----|:----|
|POST|/xiaoqu|MSG_T_GET_AREA_CHEWEI<br>MSG_T_GET_XIAOQU_CHEWEI|


#### 2.2.1 获取周边车位信息
上报报文
```
    {
        type: MSG_T_GET_AREA_CHEWEI,
        longitude: 116.404,
        latitude: 39.915,
        lonScope: 2,
        latScope: 2
    }
```
    
回复报文
```
    {
        type: MSG_TYPE_GET_AREA_CHEWEI,
        ret：0,
        data: {
            info: [
                {
                    name: "万科一期",
                    cid: "1",
                    longitude: 116.404,
    	            latitude: 39.915,
                    num: 10
                },
                {
                    name: "万科二期",
                    cid: "2",
                    longitude: 116.404,
    	            latitude: 39.915,
                    num: 10
                },
            ]
        }
    }
```
#### 2.2.1 获取小区车位信息
上报报文
```
    {
        type: MSG_T_GET_XIAOQU_CHEWEI,
        cid: '1'
    }
```
    
回复报文
```
    {
        type: MSG_TYPE_GET_XIAOQU_CHEWEI,
        ret：0,
        data: {
            cid: '1',
            name: "万科一期",
            addr: "浦东新区世纪达到1000号",
            list: [
                {
                    timeStart: "13:00",
                    timeEnd: "15:00",
                    type: "hour",//"month":按月收费,"time":按次收费,"hour":按时收费,
                    num: 30,
                    price: 10,
                },
                {
                    timeStart: "16:00",
                    timeEnd: "19:00",
                    type: "hour",//"month":按月收费,"time":按次收费,"hour":按时收费,
                    num: 10,
                    price: 15,
                },
            ]
        }
    }
```
### 2.3 预定车位
|METHOD|PATH|MSG TYPE|
|------|----|:----|
|POST|/parking|MSG_TYPE_PARKING_ORDER_PRE<br>MSG_TYPE_PARKING_ORDER_POST<br>MSG_TYPE_PARKING_GET_MY_ORDER<br>MSG_TYPE_PARKING_ORDER_CANCEL|
#### 2.3.1 预定车位（PRE PAY）
上报报文
```
    {
        type: MSG_TYPE_PARKING_ORDER_PRE,
        uid: '1',
        cid: g_communityId,
        timeStart: "13:00",
        timeEnd: "15:00"
    }
```
回复报文
```
    {
        type: MSG_TYPE_PARKING_ORDER_PRE,
        ret：0,
        orderNumber: "123", //订单号
        pay: pay //需要支付的金额
    }
```

#### 2.3.2 预定车位（POST PAY）
上报报文
```
    {
        type: MSG_TYPE_PARKING_ORDER_POST,
        uid: '1',
        //cid: "1",
        //timeStart: "13:00",//该值是否由收费系统上报?
        //timeEnd: "15:00",
        orderNumber: "123", //订单号
        pay: pay //成功支付的金额
    }
```
回复报文
```
    {
        type: MSG_TYPE_PARKING_ORDER_POST,
        ret：0
    }
```

#### 2.3.3 获取我的预定
上报报文
```
    {
        type: MSG_TYPE_PARKING_GET_MY_ORDER,
        uid: '1',
    }
```
回复报文
```
    {
        type: MSG_TYPE_PARKING_GET_MY_ORDER,
        ret：0,
        data: [
            { //统一加data字段，是为了后端实现方便，可以将回复报文统一成type-ret-data-msg的格式，这个你根据情况看，改了就通知我，不改先放着也行
                orderNumber: "123", //订单号
                communityName: "万科一期",
                timeStart: "13:00",
                timeEnd: "15:00",
                price: "10",   //单价，单位：元
                priceType: "hour",//"month":按月收费,"time":按次收费,"hour":按时收费
                totalPrice: "30", //总价，单位：元
                deposit: "15" //订金，单位：元
           }
        ]
    }
```

#### 2.3.4 取消车位预定
上报报文
```
    {
        type: MSG_TYPE_PARKING_ORDER_CANCEL,
        uid: '1',
        orderNumber: "123", //订单号
    }
```
回复报文
```
    {
        type: MSG_TYPE_PARKING_ORDER_CANCEL,
        ret：0
    }
```
