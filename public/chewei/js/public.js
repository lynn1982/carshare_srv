backBtn();
setTitleHeader();

function backBtn(){
	$(".backBtn").on("click",function(){
		history.back();
		//返回后刷新页面
		location.href=document.referrer;
	});
}

function setTitleHeader() {

    var xiaoquManager = '<a href="editXiaoqu.html" class="selectTitle" target="iframe1">/ 编辑小区信息</a>';
    var titleJson = {
        xiaoquManager:xiaoquManager,
    };
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

function priAjaxGet(path, data, successfunc, errorfunc) {
    var url = window.location.protocol+"//"+window.location.host;
    $.ajax({
        type: "get",
        url: url+path,
        timeout: 2000,
        data: data,
        dataType: "json",
        success: function(ret) {
            successfunc(ret);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            errorfunc();
        }
    });
}

function priAjaxPost(path, query, successfunc, errorfunc) {
    var url = window.location.protocol+"//"+window.location.host;
    $.ajax({
        type: "post",
        url: url+path,
        timeout: 2000,  //3s
        async: true,    //异步
        data: JSON.stringify(query),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(ret) {
            successfunc(ret);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            errorfunc();
        }
    });
}

function priAjaxDel(path, successfunc, errorfunc) {
    $.ajax({
        type: "delete",
        url: path,
        timeout: 2000,
        success: function(ret) {
            successfunc(ret);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            errorfunc();
        }
    });
}
