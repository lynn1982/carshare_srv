
## 1. 后台管理接口

|METHOD|PATH|
|------|----|
|POST|/parking_manage|

消息枚举定义：

    enum{
        MSG_T_MGMT_NEW_XIAOQU,
        MSG_T_MGMT_QUERY_XIAOQU,
        MSG_T_MGMT_UPDATE_XIAOQU，
        MSG_TYPE_LOGIN_OUT，
        MSG_TYPE_LOGIN_PHONE_UNBIND，
        MSG_TYPE_PARKING_PUT,
    }；


### 1.1 小区信息登录
#### 1.1.1 新增小区
上报报文

    {
        type: MSG_T_MGMT_NEW_XIAOQU,
        city:"上海"，
        district:"浦东"，
        name:"凤凰花园"，
        addr:"上海市浦东新区机场东路888号"，
        addr_in:"上海市浦东新区机场东路888号"，
        addr_out:"上海市浦东新区机场东路888号"
    }
    
回复报文

    {
        type: MSG_T_MGMT_NEW_XIAOQU,
        ret: 0, // 0:成功，非0:失败原因
        err_str:"重复添加"，
    }

#### 1.1.2 查询小区信息
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

#### 1.1.3 更新小区信息
上报报文

    {
        type: MSG_T_MGMT_UPDATE_XIAOQU,
        community: '1'，
        addr_in:"上海市松江区机场东路888号",
        addr_out: "上海市松江区机场东路888号",
        pps_manufacture: '12',
        parking_num_total: '200'       
    }
    
回复报文

    {
        type: MSG_T_MGMT_UPDATE_XIAOQU,
        ret: 0, // 0:成功，非0:失败原因
        err_str:"重复添加"，
    } 
      
### 5.2 小区发布共享车位信息
上报报文

    {
        type: MSG_TYPE_PARKING_MANAGE_PUBLISH,
        community: '1'，
        timeStart: '09:00:00',
        timeEnd: '16:00:00' ,
        rateType: 'hour',
        rate: '10'      
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_MANAGE_PUBLISH,
        community: '1',    //小区id号
        ret: 0
    } 
    
### 5.3 统计信息
#### 5.3.1 住宅小区日常车辆进出统计
上报报文

    {
        type: MSG_TYPE_PARKING_MANAGE_CAR_STAT,
        community: '1'，
        dateStart: '2017-02-15',
        dateEnd: '2017-02-25'
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_MANAGE_CAR_STAT,
        community: '1',    //返回小区id号
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

|METHOD|PATH|
|------|----|
|POST|/user|


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

### 2.2 车位查询预定

|METHOD|PATH|
|------|----|
|POST|/xiaoqu|


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
                    communityId: "1",
                    longitude: 116.404,
    	            latitude: 39.915,
                    num: 10
                },
                {
                    name: "万科二期",
                    communityId: "2",
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
        communityId: '1'
    }
```
    
回复报文
```
    {
        type: MSG_TYPE_GET_XIAOQU_CHEWEI,
        ret：0,
        data: {
            communityId: '1',
            name: "万科一期",
            addr: "浦东新区世纪达到1000号",
            list: [
                {
                    timeStart: "13:00",
                    timeEnd: "15:00",
                    type: "time",
                    num: 30,
                    price: 10
                },
                {
                    timeStart: "16:00",
                    timeEnd: "19:00",
                    type: "time",
                    num: 10,
                    price: 15
                },
            ]
        }
    }
```
