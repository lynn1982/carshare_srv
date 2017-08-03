# 共享停车系统接口设计

***
## 1. 简介
***
## 2. 数据库定义
#### community_info (小区信息)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |int   |not null auto_increment |primary key|
|name  |varchar(64)|not null|住宅小区名|
|addr_in  |varchar(256)|not null|住宅小区地址入口|
|addr_out  |varchar(256)|not null|住宅小区地址出口|
|pps_manufacture|int|references pps_manufacture(id)|foreign key|
|parking_num_total|int||住宅小区总的车位数|
|parking_num_share|int||住宅小区可共享的车位数|
|parking_num_remain|int||住宅小区可共享的剩余车位数|
|parking_time_start|time||共享车位时间段|
|parking_time_end|time||共享车位时间段|
|rate_type|ENUM('month','hour','time')||收费类别：包月、按时、按次|
|rate|int||价格|
|is_checked|bool||是否审核通过|


#### parking_info (发布的车位信息)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |int   |not null auto_increment |primary key|
|community|int|references community_info(id)|foreign key|
|user|int|references user(id)|foreign key|
|parking_time_start|time||共享车位时间段|
|parking_time_end|time||共享车位时间段|
|info|varchar(128)||车位信息|
|create_at|timestamp||发布时间|
|is_checked|bool||是否审核通过|

#### pps_manufacture (收费系统供应商信息)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |int   |not null auto_increment |primary key|
|name  |varchar(64)|not null|收费系统供应商名称|

#### user (APP用户信息)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |int   |not null auto_increment |primary key|
|wx_name|varchar(64)||微信用户名|
|wx_id|varchar(64)||微信id号|
|passwd|char(64)||登录密码|
|phone_num|char(11)||用户手机号|
|car_license|char(10)||车牌号|
|score|int||用户积分|

#### transaction (用户交易信息)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |bigint   |not null auto_increment |primary key|
|user|int|references user(id)|foreign key|
|community|int|reference community_info(id)|foreign key|
|info|varchar(128)||车位信息|
|mode|ENUM('instant','advanced')|default:'instant'|预定模式|
|in_time|timestamp||车辆进入时间|
|out_time|timestamp||车辆驶出时间|
|create_at|timestamp||交易创建时间|
|amount|int||交易金额|
|per_amount|int||单价|


#### car_statistics (车辆进出统计)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |bigint   |not null auto_increment |primary key|
|community|int|reference community_info(id)|foreign key|
|car_license|char(10)||车牌号|
|in_time|timestamp||车辆进入时间|
|out_time|timestamp||车辆驶出时间|


#### car_statistics_report (车辆进出统计报表，根据car_statistics表来定时处理生成，日统计)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |bigint   |not null auto_increment |primary key|
|community|int|reference community_info(id)|foreign key|
|date|Date||统计日期|
|0_7_in|int||7点之前进入小区的车辆数|
|0_7_out|int||7点之前离开小区的车辆数|
|7_8_in|int||7点到8点之间进入小区的车辆数|
|7_8_out|int||7点到8点之间离开小区的车辆数|
|8_10_in|int||8点到10点之间进入小区的车辆数|
|8_10_out|int||8点到10点之间离开小区的车辆数|
|10_15_in|int||10点到15点之间进入小区的车辆数|
|10_15_out|int||10点到15点之间离开小区的车辆数|
|15_17_in|int||15点到17点之间进入小区的车辆数|
|15_17_out|int||15点到17点之间离开小区的车辆数|
|17_19_in|int||17点到19点之间进入小区的车辆数|
|17_19_out|int||17点到19点之间离开小区的车辆数|
|19_24_in|int||19点之后进入小区的车辆数|
|19_24_out|int||19点之后离开小区的车辆数|


#### income_report (小区收入统计)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |bigint   |not null auto_increment |primary key|
|month|char(16)||按月统计|
|community|int|reference community_info(id)|foreign key|
|pps|int||收费系统供应商收入统计值|
|tenement|int||小区物业收入统计值|
|owner|int||固定车位业主收入统计值|
|amount|int||当月总收入|



***
## 3. 后台与APP接口

消息枚举定义：

    enum{
        MSG_TYPE_LOGIN_PHONE,
        MSG_TYPE_LOGIN_PHONE_BIND,
        MSG_TYPE_LOGIN_IN，
        MSG_TYPE_LOGIN_OUT，
        MSG_TYPE_LOGIN_PHONE_UNBIND，
        MSG_TYPE_PARKING_PUT,
    }；

### 3.1 用户注册与登录

|METHOD|PATH|
|------|----|
|POST|/parking_login|

#### 3.1.1 用户验证手机请求

上报报文

    {
        type: MSG_TYPE_LOGIN_PHONE,
        WXuserName: "在路上"，
        WXuserId: "lsfs88"，
        phoneNumber:186xxxxxxxx
    }
    
回复报文

    {
        type: MSG_TYPE_LOGIN_PHONE,
        ret：0
    }

#### 3.1.2 用户验证手机绑定

上报报文

    {
        type: MSG_TYPE_LOGIN_PHONE_BIND,
        WXuserName: "在路上"，
        WXuserId: "lsfs88"，
        phoneNumber:186xxxxxxxx,
        phoneCheckNumber:1314
    }
    
回复报文

    {
        type: MSG_TYPE_LOGIN_PHONE_BIND,
        ret：0
    }


#### 3.1.3 用户登录

上报报文

    {
        type: MSG_TYPE_LOGIN_IN,
        WXuserName: "在路上"，
        WXuserId: "lsfs88"，
    }
    
回复报文
    {
        type: MSG_TYPE_LOGIN_IN,
        ret：0
    }

#### 3.1.4 用户注销登录

上报报文

    {
        type: MSG_TYPE_LOGIN_OUT,
        WXuserName: "在路上"，
        WXuserId: "lsfs88"
    }
    
回复报文

    {
        type: MSG_TYPE_LOGIN_OUT,
        ret：0
    }

#### 3.1.5 用户解绑手机

上报报文

    {
        type: MSG_TYPE_LOGIN_PHONE_UNBIND,
        WXuserName: "在路上"，
        WXuserId: "lsfs88"，
        phoneNumber:186xxxxxxxx
    }
    
回复报文

    {
        type: MSG_TYPE_LOGIN_PHONE_UNBIND,
        ret：0
    }

#### 3.1.6 用户绑定车牌号

上报报文

    {
        type: MSG_TYPE_LOGIN_PLATE_NO_BIND,
        WXuserName: "在路上"，
        WXuserId: "lsfs88"，
        plateNo:"沪A.A8888"
    }
    
回复报文

    {
        type: MSG_TYPE_LOGIN_PLATE_NO_BIND,
        ret：0
    }



### 3.2 用户发布共享车位信息

|METHOD|PATH|
|------|----|
|POST|/parking_publish|

#### 3.2.1 添加共享车位信息


上报报文

    {
        type: MSG_TYPE_PARKING_PUT,
        WXuserId: "lsfs88"，
        community："小区id"，
        rate_type:收费类型（包月/计时/计次），
        rate:收费标准（xx/xx/xx）,
        parkingShare：可共享的车位数，
        parkingTotal：总的车位数，
        parkingInfo：共享车位位置信息（地图坐标），
        parkingPeriods：共享时间区间，
        ppsManufacture：收费系统厂商
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_PUT,
        ret：0
    }
    
#### 3.2.2 修改共享车位信息


上报报文

    {
        type: MSG_TYPE_PARKING_ADJUST,
        WXuserId: "lsfs88"，
        community："小区id"，
        rate_type:收费类型（包月/计时/计次），
        rate:收费标准（xx/xx/xx）,
        parkingShare：可共享的车位数，
        parkingTotal：总的车位数，
        parkingInfo：共享车位位置信息（地图坐标），
        parkingPeriods：共享时间区间，
        ppsManufacture：收费系统厂商
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_ADJUST,
        ret：0
    }
    
    

### 3.3 用户选择共享车位

|METHOD|PATH|
|------|----|
|POST|/parking_order|

#### 3.3.1 预定车位


上报报文

    {
        type: MSG_TYPE_PARKING_RESERVE,
        WXuserId:"lsfs88"，
        community:"小区id"，
        reserveType:"immediately",
        parkingPeriod:"2017-7-25 16:00|2017-7-25 20:00"，
        parkingInfo："预定车位信息"
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_RESERVE,
        ret：0,
        bill:"支付链接",
        orderNumber:订单号
    }

#### 3.3.2 取消预定


上报报文

    {
        type: MSG_TYPE_PARKING_RESERVE_CANCEL,
        WXuserId:"lsfs88"，
        community:"小区id"，
        orderNumber:订单号
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_RESERVE_CANCEL,
        ret：0
    }

***
## 4. 后台与停车收费系统接口
消息枚举定义：
    enum{
        MSG_DEV_CAR_IN=0,
        MSG_DEV_CAR_OUT,
    }；
    
### 4.1 车辆进/出上报消息
上报报文
    {
        type: MSG_DEV_CAR_IN/MSG_DEV_CAR_OUT,
        dev_id: '1'， //收费系统设备
        xiaoqu_id:"1",
        chepai: "沪A-00001",     
    }
    
回复报文

    {
        type: MSG_DEV_CAR_IN/MSG_DEV_CAR_OUT,
        ret: 0
    } 

### 4.2 支付消息下发
下发报文
    {
        type: MSG_DEV_PAY_INFO,
        dev_id: '1'， //收费系统设备
        xiaoqu_id:"1",
        chepai: "沪A-00001",     
    }
    
回复报文

    {
        type: MSG_DEV_PAY_INFO,
        ret: 0
    } 


***

## 5. 后台管理接口

|METHOD|PATH|
|------|----|
|POST|/parking_management|

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
