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
|city  |varchar(128)||城市|
|district|varchar(128)||区|
|addr_in  |varchar(256)|not null|住宅小区地址入口|
|addr_out  |varchar(256)|not null|住宅小区地址出口|
|longitude|varchar(64)||经度|
|latitude|varchar(64)||纬度|
|pps_id|int|references pps_manufacture(id)|foreign key|
|mgmt_id|int|references user(id)|foreign key|
|parking_num_total|int||住宅小区总的车位数|
|parking_num_share|int||住宅小区可共享的车位数|
|parking_num_remain|int||住宅小区可共享的剩余车位数|
|parking_time_start|time||共享车位时间段|
|parking_time_end|time||共享车位时间段|
|rate_type|ENUM('month','hour','time')||收费类别：包月、按时、按次|
|rate|int||价格|
|phone|char(11)||联系人手机号|
|contacts|varchar(64)||联系人称呼|
|email|varchar(128)||联系人邮箱|
|is_checked|bool||是否审核通过|


#### parking_info (发布的车位信息)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |int   |not null auto_increment |primary key|
|community_id|int|references community_info(id)|foreign key|
|user_id|int|references user(id)|foreign key|
|rate_type|ENUM('month','hour','time')||收费类别：包月、按时、按次|
|rate|int||价格|
|parking_time_start|time||共享车位时间段|
|parking_time_end|time||共享车位时间段|
|info|varchar(128)||车位信息|
|is_checked|bool||是否审核通过|

#### pps_manufacture (收费系统供应商信息)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |int   |not null auto_increment |primary key|
|name  |varchar(64)|not null|收费系统供应商名称|
|user_id|int|references user(id)|foreign key|
|parkNum|int||停车场数量|
|phone|char(11)||联系人手机号|
|contacts|varchar(64)||联系人称呼|
|email|varchar(128)||联系人邮箱|

#### user (APP用户信息)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |int   |not null auto_increment |primary key|
|wx_name|varchar(64)||微信用户名|
|wx_id|varchar(64)||微信id号|
|login_name|varchar(64)||登录用户名|
|passwd|char(64)||登录密码|
|sex|enum('male','female')||性别|
|email|varchar(128)||用户邮箱|
|phone_num|char(11)||用户手机号|
|car_license|char(10)||车牌号|
|score|int||用户积分|
|is_active|bool|defalut false|用户是否激活|
|is_mgmt|bool|defalult false|用户是否是管理员|
|role|emun('system','changshang','xiaoqu','user')|default 'user'|用户权限|

#### transaction (用户交易信息)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |bigint   |not null auto_increment |primary key|
|user_id|int|references user(id)|foreign key|
|community_id|int|reference community_info(id)|foreign key|
|info|varchar(128)||车位信息|
|mode|ENUM('instant','advanced')|default:'instant'|预定模式|
|o_in_time|timestamp||预定开始时间|
|o_out_time|timestamp||预定结束时间|
|chepai|varchar(32)||车牌|
|c_in_time|timestamp||车辆进入时间|
|c_out_time|timestamp||车辆驶出时间|
|deposit|int||订金|
|margin|int||差额|
|amount|int||实际金额|
|per_amount|int||单价|
|state|enum('pre','progress','finish','cancel')||订单状态|
|chepai|varchar(128)||车牌号|
|xqname|varchar(128)||预定小区名称|
|priceType|enum('time','hour','month')|time:元/次，hour:元/小时,month:元/月|收费类型|

#### dev (设备)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |bigint   |not null auto_increment |primary key|
|community_id|int|reference community_info(id)|foreign key|
|chepai|varchar(128)||车牌号|
|xqname|varchar(128)||小区名称|
|in_time|Date||入场时间|
|out_time|Date||出场时间|
|dev_id|varchar(128)||设备id号|

#### car_statistics (车辆进出统计)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |bigint   |not null auto_increment |primary key|
|community_id|int|reference community_info(id)|foreign key|
|car_license|char(10)||车牌号|
|in_time|timestamp||车辆进入时间|
|out_time|timestamp||车辆驶出时间|


#### car_statistics_report (车辆进出统计报表，根据car_statistics表来定时处理生成，日统计)
|字段   |类型  |说明   |备注   |
|:-----|:-----|:------|:------|
|id    |bigint   |not null auto_increment |primary key|
|community_id|int|reference community_info(id)|foreign key|
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
|community_id|int|reference community_info(id)|foreign key|
|pps|int||收费系统供应商收入统计值|
|tenement|int||小区物业收入统计值|
|owner|int||固定车位业主收入统计值|
|amount|int||当月总收入|



***
## 3. 后台与APP接口

### 3.1 用户注册与登录

|METHOD|PATH|
|------|----|
|POST|/user|


#### 3.1.1 用户手机注册

上报报文

    {
        type: MSG_TYPE_USER_SIGNUP,
        loginName: "Jack"，
        phoneNumber:'186xxxxxxxx'
        passwd: '123456',
        rePasswd: '123456'
    }
    
回复报文

    {
        type: MSG_TYPE_USER_SIGNUP,
        ret：0,
        userId: 2
    }

上报报文

    {
        type: MSG_TYPE_USER_GET_VERCODE,
        phoneNumber: '18925617845',
    }
    
回复报文

    {
        type: MSG_TYPE_USER_SMS_SEND,
        ret：0

    }
上报报文

    {
        type: MSG_TYPE_USER_SMS_VERIFY,
        phoneNumber: '18925617845',
        code: "123467"，
    }
    
回复报文

    {
        type: MSG_TYPE_USER_SMS_VERIFY,
        ret：0
    }
    or
    {
        type: MSG_TYPE_USER_SMS_VERIFY,
        ret：1,
        msg: '验证码错误'
    }


#### 3.1.2 用户手机登录

上报报文

    {
        type: MSG_TYPE_USER_LOGIN,
        loginId: 'Jack' or '189xxxxxxxx',
        passwd: 'xxxxxx'
    }
    
回复报文

    {
        type: MSG_TYPE_USER_LOGIN,
        ret：0,
        id: 3
    }


#### 3.1.3 用户微信登录

上报报文

    {
        type: MSG_TYPE_USER_LOGIN_WX,
        WXuserName: "在路上"，
        WXuserId: "lsfs88"，
    }
    
回复报文
    {
        type: MSG_TYPE_USER_LOGIN_WX,
        ret：0,
        id: 3
    }

#### 3.1.4 用户注销登录

上报报文

    {
        type: MSG_TYPE_USER_LOGINOUT,
    }
    
回复报文

    {
        type: MSG_TYPE_USER_LOGINOUT,
        ret：0
    }



### 3.2 用户发布共享车位信息

|METHOD|PATH|
|------|----|
|POST|/parking|

#### 3.2.1 添加共享车位信息


上报报文

    {
        type: MSG_TYPE_PARKING_PUBLISH,
        communityId："小区id"，
        timeStart：共享时间区间，
        timeEnd：共享时间区间，
        info：车位地图坐标
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_PUBLISH,
        ret：0,
        id: 1
    }
    
#### 3.2.2 修改共享车位信息


上报报文

    {
        type: MSG_TYPE_PARKING_MODIFY,
        parkingId："小区id"，
        info：共享车位位置信息（地图坐标），
        timeStart：共享时间区间，
        timeEnd：收费系统厂商
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_MODIFY,
        ret：0
    }
    
#### 3.2.3 取消共享车位


上报报文

    {
        type: MSG_TYPE_PARKING_CANCEL,
        parkingId: 发布共享车位id，
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_CANCEL,
        ret：0
    }
       

### 3.3 用户选择共享车位

|METHOD|PATH|
|------|----|
|POST|/parking|

#### 3.3.1 预定车位


上报报文

    {
        type: MSG_TYPE_PARKING_ORDER,
        communityId:"小区id"，
        mode:"instant",
        parkingInfo："预定车位信息"
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_ORDER,
        ret：0,
        orderId:订单号
    }

#### 3.3.2 取消预定


上报报文

    {
        type: MSG_TYPE_PARKING_ORDER_CANCEL,
        orderId:订单号
    }
    
回复报文

    {
        type: MSG_TYPE_PARKING_ORDER_CANCEL,
        ret：0
    }

***
## 4. 后台与停车收费系统接口

|METHOD|PATH|
|------|----|
|POST|/parking_dev|


消息枚举定义：

    enum{
        MSG_DEV_CAR_IN=0,
        MSG_DEV_CAR_OUT,
        MSG_DEV_PAY_INFO，
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
|POST|/parking_manage|

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
