
## 1. 后台管理接口

|METHOD|PATH|
|------|----|
|POST|/parking_manage|

消息枚举定义：

    enum{
        MSG_TYPE_LOGIN_PHONE,
        MSG_TYPE_LOGIN_PHONE_BIND,
        MSG_TYPE_LOGIN_IN，
        MSG_TYPE_LOGIN_OUT，
        MSG_TYPE_LOGIN_PHONE_UNBIND，
        MSG_TYPE_PARKING_PUT,
    }；


### 5.1 小区信息登录
#### 5.1.1 注册
上报报文

    {
        type: MSG_TYPE_PARKING_MANAGE_LOGIN,
        name:"凤凰花园"，
        addr:"上海市松江区机场东路888号"
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_MANAGE_LOGIN,
        community: '1',    //返回小区id号
        ret: 0
    }
    or
    {
        type: MSG_TYPE_PARKING_MANAGE_LOGIN,
        ret: 1,
        msg: "小区已注册"
    }

#### 5.1.2 小区信息
上报报文

    {
        type: MSG_TYPE_PARKING_MANAGE_INFO,
        community: '1'，
        addr_in:"上海市松江区机场东路888号",
        addr_out: "上海市松江区机场东路888号",
        pps_manufacture: '12',
        parking_num_total: '200'       
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_MANAGE_INFO,
        community: '1',    //小区id号
        ret: 0
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
