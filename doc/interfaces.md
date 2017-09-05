## 目录
* [后台管理接口](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#1-后台管理接口)
   * [用户](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#11-用户)
   * [信息管理](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#12-信息管理)
      * [查询设备厂商信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#121-查询设备厂商信息)
      * [增加设备厂商信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#122-增加设备厂商信息)
      * [修改设备厂商信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#123-修改设备厂商信息)
      * [删除设备厂商信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#124-删除设备厂商信息)
      * [查询小区信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#125-查询小区信息)
      * [新增小区](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#126-增加小区信息)
      * [修改小区信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#127-修改小区信息)
      * [删除小区信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#128-删除小区信息)
      * [修改小区统一管理的共享车位信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#129-修改小区统一管理的共享车位信息)
   * [业务数据查询](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#13-业务数据查询)
      * [查询车辆进出记录](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#131-查询车辆进出记录)
      * [查询某个设备厂商的账单明细](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#132-查询某个设备厂商的账单明细)
      * [查询某个小区的账单明细](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#133-查询某个小区的账单明细)
      * [查询某个用户的账单明细](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#134-查询某个用户的账单明细)
   * [RESTful API List](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#14-restful-api-list)

* [后台与APP接口](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#2-后台与app接口)
    * [用户注册与登录](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#21-用户注册与登录)
        * [获取手机验证码](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#211-获取手机验证码)
        * [手机验证码登陆](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#212-手机验证码登陆)
        * [获取用户信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#213-获取用户信息)
        * [修改用户信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#214-修改用户信息)
        * [用户注销登录](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#215-用户注销登录)
    * [车位查询](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#22-车位查询)
        * [获取周边车位信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#221-获取周边车位信息)
        * [获取小区车位信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#221-获取小区车位信息)
    * [车位预定](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#23-预定车位)
        * [预定车位(pre-pay)](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#231-预定车位pre-pay)
        * [预定车位(post-pay)](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#232-预定车位post-pay)
        * [获取我的预定](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#233-获取我的预定)
        * [取消车位预定](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#234-取消车位预定)
     * [个人信息查询](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#24-个人信息查询)
        * [查看我的历史停车信息](https://github.com/lynn1982/carshare_srv/blob/master/doc/interfaces.md#241-查看我的历史停车信息)

## 1. 后台管理接口
### 1.1 用户
#### 1.1.1 登陆
#### 1.1.2 退出
### 1.2 信息管理

|METHOD|PATH|MSG TYPE|
|------|----|----|
|POST|/pps|MSG_T_MGMT_QUERY_PPS<br>MSG_T_MGMT_NEW_PPS<br>MSG_T_MGMT_UPDATE_PPS<br>MSG_T_MGMT_DEL_PPS|
|POST|/xiaoqu|MSG_T_MGMT_QUERY_XIAOQU<br>MSG_T_MGMT_NEW_XIAOQU<br>MSG_T_MGMT_UPDATE_XIAOQU<br>MSG_T_MGMT_DELETE_XIAOQU<br>MSG_T_MGMT_UPDATE_XIAOQU_CHEWEI_0|

#### 1.2.1 查询设备厂商信息
上报报文
```
    {
        type: MSG_T_MGMT_QUERY_PPS,
        name: 'xxx'
    }
```    
回复报文
```
    {
        type: MSG_T_MGMT_QUERY_PPS,
        ret: 0,
        data: [
          {
            id: 1,
            name: "设备生产厂商1",
            phone: "18616999999",
            contacts: "赵先生",
            email: "zhao@changshang.com",
            parkNum: 10,
            regDate: "2017-8-31"
          }
        ];
    }
```
#### 1.2.2 增加设备厂商信息
上报报文
```
    {
        type: MSG_T_MGMT_NEW_PPS,
        name: 'xxx',
        phone: '18765234167',
        contacts: '马先生',
        email: 'aaa@qq.com',
        parkNum: 11
    }
```    
回复报文
```
    {
        type: MSG_T_MGMT_QUERY_PPS,
        ret: 0,
        id: 3
    }
```

#### 1.2.3 修改设备厂商信息
上报报文
```
    {
        type: MSG_T_MGMT_UPDATE_PPS,
        id: 1,
        name: 'xxx',
        phone: '18765234167',
        contacts: '马先生',
        email: 'aaa@qq.com',
        parkNum: 11
    }
```    
回复报文
```
    {
        type: MSG_T_MGMT_UPDATE_PPS,
        ret: 0,
    }
```
#### 1.2.4 删除设备厂商信息
上报报文
```
    {
        type: MSG_T_MGMT_DEL_PPS,
        id: 1,
    }
```    
回复报文
```
    {
        type: MSG_T_MGMT_DEL_PPS,
        ret: 0,
    }
```
#### 1.2.5 查询小区信息
上报报文
```
    {
        type: MSG_T_MGMT_QUERY_XIAOQU,
        city:"上海"，
        district:"浦东"，
        name:"凤凰花园"，
    }
```    
回复报文
```
    {
        type: MSG_T_MGMT_QUERY_XIAOQU,
        ret: 0,
        data: [
            {}, //小区1的信息
            {}, //小区2的信息
            {}  //小区3的信息        ]
        ]
    }
```
#### 1.2.6 增加小区信息
上报报文
```
    {   //新增小区时，不包括车位相关的信息
        type: MSG_T_MGMT_NEW_XIAOQU,
        city:"上海"，
        district:"浦东"，
        name:"凤凰花园"，
        addr_in:"上海市浦东新区机场东路888号"，
        addr_out:"上海市浦东新区机场东路888号",
        longitude: "233.121",
        latitude: "110.432",
        phone: '18765234167',
        contacts: '马先生',
        email: 'aaa@qq.com',
    }
```   
回复报文
```
    {
        type: MSG_T_MGMT_NEW_XIAOQU,
        ret: 0, // 0:成功，非0:失败原因
        cid: 2,
        msg:"重复添加"  //非0:失败原因
    }
```

#### 1.2.7 修改小区信息
上报报文
```
    {   //修改小区信息，携带的字段是以下字段的全部或部分，后台只更新消息中携带的字段值，其他的保持不变
        type: MSG_T_MGMT_UPDATE_XIAOQU,
        cid: '1'，
        //以下非必须
        addr_in:"上海市松江区机场东路888号",
        addr_out: "上海市松江区机场东路888号",
        city: "上海",
        district: '浦东',
        longitude: '221.342',
        latitude: '551.733',
        phone: '18765234167',
        contacts: '马先生',
        email: 'aaa@qq.com',
        parking_num_total: '200',
        timeStart: '10:00',
        timeEnd: '19:00',
        rateType: 'time',
        price: '10'
    }
```    
回复报文
```
    {
        type: MSG_T_MGMT_UPDATE_XIAOQU,
        ret: 0, // 0:成功，非0:失败原因
        msg:"重复添加"，
    } 
```
#### 1.2.8 删除小区信息
上报报文
```
    {
        type: MSG_T_MGMT_DELETE_XIAOQU,
        cid: 1,
    }
```    
回复报文
```
    {
        type: MSG_T_MGMT_DELETE_XIAOQU,
        ret: 0,
    }
```

#### 1.2.9 修改小区统一管理的共享车位信息
上报报文
```
    {
        type: MSG_T_MGMT_UPDATE_XIAOQU_CHEWEI_0,
        cid: '1'，
        parking_num_total: '200',
        timeStart: '10:00',
        timeEnd: '19:00',
        rateType: 'time',
        price: '10'
    }
```    
回复报文
```
    {
        type: MSG_T_MGMT_UPDATE_XIAOQU,
        ret: 0, // 0:成功，非0:失败原因
        msg:"重复添加"，
    } 
```
### 1.3 业务数据查询
#### 1.3.1 查询车辆进出记录
上报报文
```
    {
        type: MSG_T_MGMT_CAR_STAT,
        chepai: 'xxxxx' //查询条件:车牌或者小区
        cname: '万科一期'
    }
```    
回复报文
```
    {
        type: MSG_T_MGMT_CAR_STAT,
        ret: 0,
        data: [
          {
            chepai: "沪A-111111",
            cname: "万科一期",
            date: "2017-1-1",
            inTime: "12:00",
            outTime: "14:00",
            isPay: "是"
          },
          {
            chepai: "沪B-111111",
            cname: "万科二期",
            date: "2017-2-2",
            inTime: "15:00",
            outTime: "16:00",
            isPay: "否"
          }
        ];
    }
```
#### 1.3.2 查询某个设备厂商的账单明细
上报报文
```
    {
        type: MSG_T_MGMT_PPS_ACCOUNT,
        id: 2,
        dateStart: '2017-08-11',
        dateEnd: '2017-08-31'
    }
```    
回复报文
```
    {
        type: MSG_T_MGMT_PPS_ACCOUNT,
        ret: 0,
        data: {
            income: 1200,
            ...
        }
    }
```
#### 1.3.3 查询某个小区的账单明细
上报报文
```
    {
        type: MSG_T_MGMT_XIAOQU_ACCOUNT,
        cid: 1,
        dateStart: '2017-08-11',
        dateEnd: '2017-08-31'
    }
```    
回复报文
```
    {
        type: MSG_T_MGMT_XIAOQU_ACCOUNT,
        ret: 0,
        data: {
            income: 1200,
            ...
        }
    }
```

#### 1.3.4 查询某个用户的账单明细
上报报文
```
    {
        type: MSG_TYPE_USER_ACCOUNT,
        uid: 1,
        dateStart: '2017-08-11',
        dateEnd: '2017-08-31'
    }
```    
回复报文
```
    {
        type: MSG_TYPE_USER_ACCOUNT,
        ret: 0,
        data: {
            income: 1200,
            ...
        }
    }
```

### 1.4 RESTful API List
   - POST/PUT/DELETE成功回复报文
```
{
  ret: 0
}
```
   - GET成功回复报文
```
{
  ret: 0,
  data: {
  }
}
```
   - 失败回复报文
```
{
  ret: [非0值],
  msg: ""
}
```
   - URL列表
|URL|METHOD|功能|
|:----|:----:|:----|
|/pps/|POST|创建厂商|
|/pps/<objId>|GET|获取厂商信息|
|/pps/<objId>|PUT|修改厂商信息|
|/pps/<objId>|DELETE|删除厂商信息|
|/xiaoqu/|POST|创建厂商|
|/xiaoqu/<objId>|GET|获取厂商信息|
|/xiaoqu/<objId>|PUT|修改厂商信息|
|/xiaoqu/<objId>|DELETE|删除厂商信息|
  
  
  
## 2. 后台与APP接口
### 2.1 用户注册与登录

|METHOD|PATH|MSG TYPE|
|:----:|:-----:|:----|
|POST|/user|MSG_TYPE_USER_GET_VERCODE<br>MSG_TYPE_USER_VERCODE_LOGIN<br>MSG_TYPE_USER_GET_INFO<br>MSG_TYPE_USER_CHANGE_INFO<br>MSG_TYPE_USER_LOGINOUT|


#### 2.1.1 获取手机验证码

上报报文
```
    {
        type: MSG_TYPE_USER_GET_VERCODE,
        phoneNumber: '18925617845'
    }
```    
回复报文
```
    {
        type: MSG_TYPE_USER_GET_VERCODE,
        ret：0
    }
```
#### 2.1.2 手机验证码登陆

上报报文
```
    {
        type: MSG_TYPE_USER_VERCODE_LOGIN,
        phoneNumber: '18925617845',
        verCode: '1234'
    }
```    
回复报文
```
    {
        type: MSG_TYPE_USER_VERCODE_LOGIN,
        ret：0
    }
```

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
        chepai: "沪A-00001",
        phone: "18616996666"
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
#### 2.1.5 用户注销登录

上报报文
```
    {
        type: MSG_TYPE_USER_LOGINOUT,
    }
```    
回复报文
```
    {
        type: MSG_TYPE_USER_LOGINOUT,
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
        data: [
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
                    resId: 1,
                    timeStart: "13:00",
                    timeEnd: "15:00",
                    type: "hour",//"month":按月收费,"time":按次收费,"hour":按时收费,
                    num: 30,
                    price: 10,
                },
                {
                    resId: 2,
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
        cid: g_communityId,
        resId: 1,
        timeStart: "2017-08-14 13:00:00",
        timeEnd: "2017-08-14 15:00:00"
    }
```
回复报文
```
    {
        type: MSG_TYPE_PARKING_ORDER_PRE,
        ret：0,
        resId: 1,
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
        orderNumber: "123", //订单号
        //pay: pay //成功支付的金额
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
        data: 
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
### 2.4 个人信息查询
|METHOD|PATH|MSG TYPE|
|------|----|:----|
|POST|/parking|MSG_TYPE_GET_HISTORY_PARK_INFO|
#### 2.4.1 查看我的历史停车信息
上报报文
```
    {
        type: MSG_TYPE_GET_HISTORY_PARK_INFO,
        uid: '1',
        startIdx: 100,
        num: 20
    }
```
回复报文
```
    {
        type: MSG_TYPE_GET_HISTORY_PARK_INFO,
        ret：0,
        data: [ //按时间排序，最近的记录在最前面
          {
            timeStart: "2017-08-11 13:00:00",
            timeEnd: "2017-08-11 15:00:00",
            communityName: "万科一期",
            totalPrice: "30"
          },
          {
            timeStart: "2017-08-10 9:00:00",
            timeEnd: "2017-08-10 15:00:00",
            communityName: "三湘世纪",
            totalPrice: "45"
          }
        ]
    }
```
