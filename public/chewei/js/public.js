backBtn();
setTitleHeader();
//bigBackBtn();//设置大返回按钮



function backBtn(){
	$(".backBtn").on("click",function(){
		history.back();
		
//		alert("返回");
		//返回后刷新页面
		location.href=document.referrer;
	});
}



function setTitleHeader() {
	
	var xiaoquManager = '<a href="editXiaoqu.html" class="selectTitle" target="iframe1">/ 编辑小区信息</a>';
	
	//插件
	var addPlugin =
		'<a href="addPlugin.html" class="selectTitle" target="iframe1">/ 添加插件</a>';
	var pluginVersion =
		'<a href="pluginVersion.html" class="selectTitle" target="iframe1">/ 插件版本</a>';
	var addPluginVersion =
		'<a href="pluginVersion.html" class="selectTitle" target="iframe1">/ 插件版本</a>'+
		'<a href="addPluginVersion.html" class="selectTitle" target="iframe1">/ 添加版本</a>';
	//设备
	var addDevice = '<a href="addDevice.html" class="selectTitle" target="iframe1">/ 添加设备</a>';
	var deviceDetail = '<a href="deviceDetail.html" class="selectTitle" target="iframe1">/ 设备详情</a>';
	var addFirmwareVersion = '<a href="deviceDetail.html" class="selectTitle" target="iframe1">/ 设备详情</a>'+
                       '<a href="addFirmwareVersion.html" class="selectTitle" target="iframe1">/ 添加固件版本</a>';
	var addCode1 = '<a href="addCode.html" class="selectTitle" target="iframe1">/ 添加红外码库</a>';
	var addLircDevice = '<a href="addLircDevice.html" class="selectTitle" target="iframe1">/ 添加红外设备</a>';
	var lircDeviceDetail = '<a href="lircDeviceDetail.html" class="selectTitle" target="iframe1">/ 红外设备详情</a>';
     
     var  router_retransmission = '<a href="router_retransmission.html" class="selectTitle" target="iframe1">/ 直播资源转发情况</a>';
     
     var  router_currentresourceSmall = '<a href="router_currentresourceSmall.html" class="selectTitle" target="iframe1">/ 路由器当前直播资源</a>';
     
     var  router_historyresourceSmall = '<a href="router_historyresourceSmall.html" class="selectTitle" target="iframe1">/ 路由器历史直播资源</a>';
     
     
     
    var titleJson = {xiaoquManager:xiaoquManager,lircDeviceDetail:lircDeviceDetail,addLircDevice:addLircDevice,"addCode1":addCode1,"addPlugin":addPlugin,"pluginVersion":pluginVersion,"addPluginVersion":addPluginVersion,"addDevice":addDevice,"deviceDetail":deviceDetail,"addFirmwareVersion":addFirmwareVersion,"router_retransmission":router_retransmission,"router_currentresourceSmall":router_currentresourceSmall,"router_historyresourceSmall":router_historyresourceSmall};
      //删除
     $(".titleContainer",parent.document).find(".selectTitle").not(":first").remove();
    var fileName = $("#fileName").attr("fileNam");
    var titleEle = titleJson[fileName];
//  alert(titleEle);
if(titleEle){
	
     //添加
    $(".titleContainer",parent.document).append(titleEle);
}
   
}


//ajax请求
var urlArr = ["", "/firmware/status", "/firmware/queryAllnow", "/firmware/queryById", "/firmware/queryAllhistory", "/firmware/queryAllroute", "/firmware/querynowmsg", "/firmware/queryhismsg", "/firmware/totalBytesBytime", "/firmware/totalsumByweek","/firmware/totalBytesBydeviceId"];

function myajax(urli,type,data,succallback){
	// alert(urlArr[urli])

	$.ajax({
        type: type,
        url: urlArr[urli],
        async: true,
        data:data,
        cache: false,
        success: succallback,
        error: function () {
//       alert("加载失败!");
        }
    });//ajax
}
