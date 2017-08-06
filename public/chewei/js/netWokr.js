/*说明
 * 1.不需要显示的数据如pluginId由影藏的td的text保存
 * 
 */
/*添加返回按钮*/
/*(function  bigBackBtn() {
 var backBtn = '<div class="bigBackBtn fobidSelect">返回</div>';
 $("body").append(backBtn);
 $(".bigBackBtn").on("click",function () {
 history.back();
 location.href=document.referrer;
 });

 })();*/


function clearInput() {
    return;
    $("input[type='text']").val("");
    $("input[type='file']").val("");
}

/*1.接口url  thumbnail*/
var allPluginUrl = "/plugin/allPlugin"; //get
var queryPluginUrl = "/plugin/queryPluginVersion"; //post
var addPluginUrl = "/plugin/addPlugin"; //post
var deletePluginUrl = "/plugin/deletePlugin"; //post
var deletePluginVersionUrl = "/plugin/deleteVersion";
var publishVersionUrl = "/plugin/publishVersion";
var addPluginVersionUrl = "/plugin/fileupload";
var pluginVersionIsOk = "/plugin/pluginVersionIsOk"
var allDeviceUrl = "/dev/allDev";
var addDeviceUrl = "/dev/addDataModel";
var addDataModelUrl = "/dev/fileupload";
var addDevicePluginUrl = "/dev/addPlugin";
var deleteDeviceUrl = "/dev/deleteDataModel";
var changDataModel = "/dev/changeDataModel";
var queryFirmwareVersionUrl = "/firmware/queryFirmwareVersion";
var publishFirmwareVersionUrl = "/firmware/publishVersion";
var deleteFirmwareVersionUrl = "/firmware/deleteVersion";
var addFirmwareVersionUrl = "/firmware/fileupload";
var addFirmwareUrl = "/firmware/addFirmware";
var firmwareVersionIsOk = "/firmware/firmwareVersionIsOk";
var getStatusUrl = "/dev/stat";
var allCodeUrl = "/lirc/allCode";
var deleteCodeUrl = "/lirc/delete";
var addCodeUrl = "/lirc/fileupload";
var allDevUrl = "/lirc/allDev";
var devDeleteUrl = "/lirc/devDelete"; 
var devAddUrl = "/lirc/devAdd";

/*1.接口url*/
/*2.判断哪个*/
(function getdata() {
    var fileName = $("#fileName").attr("fileNam");
    switch (fileName) {
        case "plugin":
            plugin()
            break;
        case "pluginVersion":
            pluginVersion()
            break;
        case "addPlugin":
            addPlugin()
            break;
        case "addPluginVersion":
            addPluginVersion();
            break;
        case "device":
            device();
            break;
        case "addDevice":
            addDevice();
            break;
        case "deviceDetail":
            deviceDetail();
            break;
        case "addFirmwareVersion":
            addFirmwareVersion();
            break;
        case "status":
            status();
            break;
        case "lircCode":
            lircCode();
            break;
        case "addCode1":
            addCode1();
            break;
        case "lircDevice":
            lircDevice();
            break;
        case "lircDeviceDetail":
            lircDeviceDetail();
            break;
        case "addLircDevice":
            addLircDevice();
            break;
        default:
            break;
    }
})();
/*-----------------------------------------获取url参赛---------------------------------------------------*/


/*----------------------------------------存储-------------------------------------------------------*/
function  storage(value,key) {

    window.sessionStorage[value] = key;
}
function  getStorage(value) {

    return window.sessionStorage[value];
}
/*-------------------------------------------------判断是否是json-----------------------------------*/
function strIsJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {

        return false;
    }
    return true;
}
/*-------------------------------------------------读取本地文件-----------------------------------*/

/*-------------------------------------------------读取input本地文件-----------------------------------*/
function upload(input, callback) {
    if ($(input).val() == "") {
        callback(1);
        return;
    }
    //支持chrome IE10
    if (window.FileReader) {
        var file = input.files[0];
        filename = file.name.split(".")[0];
        var reader = new FileReader();
        reader.onload = function () {
            callback(this.result);
        }
        reader.readAsText(file);
    }
    //支持IE 7 8 9 10
    else if (typeof window.ActiveXObject != 'undefined') {

        var xmlDoc;
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;

        try {
            xmlDoc.load(input.value);
            callback(xmlDoc.xml);
        }catch (e){
            callback(1);
        }



    }
    //支持FF
    else if (document.implementation && document.implementation.createDocument) {
        var xmlDoc;
        xmlDoc = document.implementation.createDocument("", "", null);
        xmlDoc.async = false;
        xmlDoc.load(input.value);
        callback(xmlDoc.xml);
    } else {
        alert('error');
    }
}//upload
/*2.判断哪个*/
/*---------------------------------3.添加cell方法----------------------------*/
function addCell(table, cell, arr, keyname) {
    for (var i = 0; i < arr.length; i++) {
        var dic = arr[i];
        var cell1 = $(cell).clone();
        var table = $(table);
        for (var key in dic) {
            if ($(cell1).children().length != 0) { //判断cell本身是不是只有一个元素
                $(cell1).find("[name=" + key + "]").text(dic[key]);
            } else {
                if (key == keyname) {
                    $(cell1).text(dic[key]).val(dic["pluginId"] ? dic["pluginId"] : dic[key]);
                }//if2
            }
        }
        $(cell1).show();
        $(table).append(cell1);
    } //for

} //addCell2  cell有问题
/*---------------------------------3.添加cell方法----------------------------*/
function addCell4(table, cell, arr) {
    for (var i = 0; i < arr.length; i++) {
        var dic = arr[i];
        var cell1 = $(cell).clone();
        var table = $(table);
       //alert(arr.length);
        for (var key in dic) {


            if ($(cell1).children().length ==  0  && $(cell1).attr("name") == key) { //判断cell本身是不是只有一个元素
                $(cell1).text(dic[key]);

            }
        }
        $(cell1).show();
        $(table).append(cell1);
    } //for

} //addCell2  cell有问题
function addCell2(table, cell, arr, publishVersion) {
    for (var i = 0; i < arr.length; i++) {
        var dic = arr[i];
        var cell1 = $(cell).clone();
        var table = $(table);
        for (var key in dic) {
            $(cell1).find("[name=" + key + "]").text(dic[key]);
            if (dic["version"] == publishVersion) {
                $(cell1).find(".pluginDelete").text("在线").css("background", "orange");
                //$(cell1).find(".pluginDelete").hide();
            }
        }
        $(cell1).show();
        $(table).append(cell1);
    } //for

} //addCell2
function addCell3(table, cell, arr, keyname) {
    for (var i = 0; i < arr.length; i++) {
        var dic = arr[i];
        var cell1 = $(cell).clone();
        var table = $(table);
        for (var key in dic) {
            val = dic[key];
            if (key == keyname && dic[key] == null) {
                val = "无发布版本";
            }
            $(cell1).find("[name=" + key + "]").text(val);
        }
        $(cell1).show();
        $(table).append(cell1);
    } //for

} //addCell2  cell有问题
/*----------------------------遍历form内容input和textarea-------------------------------*/
function getInputName(formId) {
    var json = {};
    var inputs = $(formId + " input");
    var textareas = $(formId + " textarea");

    for (var i = 0; i < inputs.length; i++) {
        var inputa = $(inputs[i]);
        var name = $(inputs[i]).attr("name");
        if (name) {
            json[name] = $(inputs[i]).val();
        }
    } //for
    for (var i = 0; i < textareas.length; i++) {
        var textarea = $(textareas[i]);
        var tname = $(textareas[i]).attr("name");
        if (tname) {
            json[tname] = $(textareas[i]).val();
        }
    } //for
    return json;
}
/*--------------------------获取父元素中所有属性名为x的值返回json----------------------------*/
function getDataFromEle(parentEle, clickEle, attrName) {
    var childEle = $(clickEle).parents(parentEle).children();
    var data = {};
    for (var i = 0; i < childEle.length; i++) {
        var child = childEle[i];
        var key = $(child).attr(attrName);
        var val = $(child).text();
        if (!key) {
            continue;
        }
        data[key] = val;
    }
    return data;
}
/*-----------------------------------打印遍历json-------------------------------------------*/
function logJson(myJson) {
    for (var key in myJson) {
        console.log(myJson[key]);
    }
}
/*------------------------------------表单验证---------------------------------------------*/
function checkForm(form, btn, rulesJson, messagesJson, successFun) {
    $(btn).on("click", function () {

        $(form).submit();
    });

    $(form).validate({
        invalidHandler: function () {
            return false;
        },
        submitHandler: function (form) {
            successFun(form);
        },
        errorPlacement: function (error, element) {
            error.insertBefore(element);
        },
        rules: rulesJson,
        messages: messagesJson
    });

}

/*-------------------------------------查看插件---------------------------------------------*/
/*一.设置插件数据*/
function plugin() {

    $.ajax({
        type: "get",
        url: allPluginUrl,
        async: true,
        cache: false,
        success: setPluginData,
        error: function () {
            alert("加载失败尝试刷新页面");
        }
    });
    function setPluginData(data) {
        //alert(data);
        var dataObj = JSON.parse(data);
        var arr = dataObj.values;

        addCell3("#table", "#cell", arr, "publishVersion");
        /*---------------------------------查看版本信息-------------------------------------------*/
        $(".pluginVersion").on("click", function () {
            var pluginId = $(this).parent().siblings("[name='pluginId']").text();

            //使用父元素保存pluginId
            $("#fileName", parent.document).attr("pluginId", pluginId);
            $("#iframe1", parent.document).attr({
                "src": "pluginVersion.html"
            });
        }); //click
        /*---------------------------------添加插件------------------------------------------*/
        $(".addPluginBtn").on("click", function () {

        });
        /*----------------------------------删除插件-----------------------------------------*/
        $(".pluginDelete").on("click", function () {


            var sure = confirm("确定删除吗?");
            var pluginId = $(this).parent().siblings("[name='pluginId']").text();
            if (sure) {
                clearInput();
                $.ajax({
                    type: "post",
                    url: deletePluginUrl,
                    async: true,
                    data: {
                        "pluginId": pluginId
                    },
                    success: function (data) {
                        //alert("succes");
                        window.location.reload();
                    },
                    error: function () {
                        alert("删除失败");
                    }
                });
            } //if
        }); //onclick

    }//successCallback
    /*----------------------------------删除插件-----------------------------------------*/

} //plugin

/*一.设置插件数据*/
/*二：查询插件版*/
function pluginVersion() {
    var pluginId = $("#fileName", parent.document).attr("pluginId");
    var thisdata = {
        "pluginId": pluginId
    };


    var queryData = null;//读取所有插件版本

    $.ajax({
        type: "post",
        url: queryPluginUrl,
        async: true,
        data: thisdata,
        success: pluginVersionCallBack,
        error: function () {
            alert("查询失败");
        },
        timeout: 5000

    }); //ajax

    function pluginVersionCallBack(data) {

        queryData = JSON.parse(data);
        var publishVersion = queryData.publishVersion;

        var queryArr = queryData.values;

        addCell2("#table", "#cell", queryArr, publishVersion);
        /*--------------------------------------删除插件版本----------------------------*/
        $(".pluginDelete").on("click", function () {
            if ($(this).text() == "在线") {
                alert("在线版本无法操作");
                return;
            }
            var version = $(this).parent().siblings("[name='version']").text();
            var thisdata = {
                "pluginId": pluginId,
                "version": version
            };
            var sure = confirm("确定删除吗?");
            if (sure) {
                clearInput();
                $.ajax({
                    type: "post",
                    url: deletePluginVersionUrl,
                    async: true,
                    data: thisdata,
                    success: function () {
                        window.location.reload();
                    },
                    error: function () {
                        alert("删除失败!");
                    }

                });
            }//if
        });
        /*三：---------------------------------发布插件版本----------------------------------*/
        //选择固件版本下拉框获取数据
        addCell("#selectVersion", "#selectCell", queryArr, "version");
        $(".publishPluginVersion").on("click", function () {
            if ($("#selectVersion").prop("selectedIndex") == 0) {
                alert("请选择版本!");
                return;
            }
            var version = $(".selectedVersion").val();
            var thisdata = {
                "pluginId": pluginId,
                "version": version
            };

            clearInput();
            $.ajax({
                type: "post",
                url: publishVersionUrl,
                async: true,
                data: thisdata,
                success: function () {
                    alert("发布成功");
                    window.location.reload();
                },
                error: function () {
                    alert("发布失败请重试!");
                }
            });

        });
    }//pluginVersionCallBack
}
/*二：查询插件版*/

/*三：---------------------------------添加插件----------------------------------*/
function addPlugin() {

    checkForm("#addPluginForm", ".inputSubmit", {
        pluginName: "required",
        pluginDesc: "required"
    }, {
        pluginName: "请输入插件名",
        pluginDesc: "请输入插件描述"
    }, function (form) {
        submitPlugin();
    });

    function submitPlugin() {

        var thisdata = getInputName("#addPluginForm");
        //alert(thisdata.pluginDesc);

        $.ajax({
            type: "post",
            url: addPluginUrl,
            async: true,
            data: thisdata,
            success: function (data) {
                if (data) {
                    var sure = confirm("添加成功是否继续添加");
                    if (!sure) {
                        history.back();
                    }
                    clearInput();
                }
            },
            error: function () {
                alert("请求失败");
            }
        }); //ajax

    }//submitPlugin
} //addPlugin

/*------------------------------四:添加插件版本-----------------------------------*/

function addPluginVersion() {
    var json = getInputName("#addVersionForm");
    var pluginId = $("#fileName", parent.document).attr("pluginId");
    json["pluginId"] = pluginId;
    checkForm("#addVersionForm", ".inputSubmit", {
        version: {
            required:true,
            remote:{
                url:pluginVersionIsOk,
                type:"Post",
                data:{
                    version:$(".inputname").val(),
                    pluginId:pluginId
                }
            }
        },
        md5: "required",
        versionDesc: "required",
        thumbnail: "required"
    }, {
        version:{
           required: "请输入版本号",
            remote:"插件版本已存在"
        } ,
        md5: "请输入md5值",
        versionDesc: "请输入描述",
        thumbnail: "请选择插件"

    }, function (form) {

        submitPluginVersion();
    });


    //ajaxSonsubmit会自动获取input内容
    function submitPluginVersion() {
        $("#addVersionForm").ajaxSubmit({
            type: 'post',
            url: addPluginVersionUrl,
            //这里需要一个pluginId
            data: {
                "pluginId": pluginId
            },
            success: function (data) {
                var sure = confirm("上传成功,继续上传?");
                if (!sure) {
                    history.back();
                }
                clearInput();
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                alert("上传失败");
            }
        }); //ajax

    }//submitPluginVersion
} //addPluginVersion
/*-----------------------------设备类型管理------------------------------------------*/

/*-----------------------------查询设备类型-----------------------------------------*/
function device() {
    $.ajax({
        type: "get",
        url: allDeviceUrl,
        async: true,
        cache: false,
        success: deviceSuccess,
        error: function () {
            alert("加载失败尝试刷新页面");
        }
    }); //ajax
    /*
     var data = {
     "ret": 0,
     "values": [{
     "dataModelId": "1",
     "manufacture": 'xxxxx',
     " manufactureDataModelId": 'xxxxx',
     "devDesc": "xxxxxxxx",
     "jsonIsExist": 1,
     "pluginId": '2',
     "firmwareId": '3'
     }, {
     "dataModelId": "2",
     "manufacture": 'xxxxx',
     "manufactureDataModelId": 'xxxxx',
     "devDesc": "xxxxxxxx",
     "jsonIsExist": 1,
     "pluginId": '1',
     "firmwareId": '1'
     }]
     };
     */
    function deviceSuccess(data) {
//alert(data);
        var data1 = JSON.parse(data);
        var arr = data1.values;
        addCell("#table", "#cell", arr);
        /*---------------------------------------删除设备------------------------------------*/
        $(".pluginDelete").on("click", function () {
            var dataModelId = $(this).parent().siblings("[name='dataModelId']").text();

            var dataD = {"dataModelId": dataModelId};
            var sure = confirm("确定删除吗?");
            if (sure) {
                clearInput();
                $.ajax({
                    type: "post",
                    url: deleteDeviceUrl,
                    async: true,
                    data: dataD,
                    cache: false,
                    success: function () {

                        alert("删除成功");
                        window.location.reload();
                    },
                    error: function () {
                        alert("删除失败");
                    },
                    timeout: 3000

                });//ajax
            }//if
        });
        /*------------------------------------查看详情-------------------------------------------*/
        $(".pluginVersion").on("click", function () {

            var data = getDataFromEle("#cell", this, "name");
            var dataStr = JSON.stringify(data);//alert(dataStr);
            storage("deviceDataStr",dataStr);
           // window.sessionStorage.deviceDataStr = dataStr;


        });

    }//success
} //device

/*--------------------------------------添加设备------------------------------------*/
function addDevice() {
    //表单验证
    checkForm("#addDevice", ".inputSubmit", {
        name: "required",
        manufacture: "required",
        manufactureDataModelId: {
            required: true,
            number: true,
        }
    }, {
        name: "请输入设备名称",
        manufacture: "请输入厂商名",
        manufactureDataModelId: {
            required: "请输厂商数据模型ID",
            number: "厂商数据模型ID必须为数字"
        },

    }, function (form) {

        //验证文件是否为jison
        upload($(".file")[0], function (result) {
            if (!strIsJson(result)) {
                alert("文件格式错误,必须为json格式!");
            } else {
                submitDev();
            }
        });//upload

    });
    /*--------------------------------------获取所有插件供选择-----------------------------*/
    $.ajax({
        type: "get",
        url: allPluginUrl,
        async: true,
        cache: false,
        success: function (data) {
            //alert(data);
            var data1 = JSON.parse(data);
            var arr = data1.values;
            addCell("#tablePlugin", "#cellPlugin", arr, "pluginName");
        },
        error: function () {
            //			alert("加载失败尝试刷新页面");
        }
    }); //ajax


    /*-------------------------------添加设备函数----------------------------------*/
    function submitDev() {

        function addDevInfo(data,success,error) {
            $.ajax({
                type: "post",
                url: addDeviceUrl,
                data: data,
                async: true,
                cache: false,
                success: function (data) {
                    if(success){
                        success(data);
                    }
                },//success
                error: function () {
                    if(error){
                        error(data);
                    }

                }
            });//deviceAjax
        }//addDevInfo

        function addDevFirmware(data,success,error) {
            $.ajax({
                type: "post",
                url: addFirmwareUrl,
                cache: false,
                data:data,
                async: true,
                success: function (data) {
                    if(success){
                        success(data);
                    }

                },
                error: function () {
                    if(error){
                        error(data);
                    };
                },
                timeout: 3000
            });
        }//addDevFirmware
        function addDevPlugin(data,success,error) {

            $.ajax({
                type: "post",
                url: addDevicePluginUrl,
                data: data,
                async: true,
                cache: false,
                success: function (data) {
                    if(success){
                        success(data);
                    }
                },
                error: function () {
                    if(error){
                        error(data);
                    }
                },
                timeout: 3000
            });
        }//addDevPlugin

        function addDevDataModel(data,success,error) {

            $("#addDataModel").ajaxSubmit({
                type: 'post',
                url: addDataModelUrl,
                cache: false,
                data: data,
                success: function (data) {
                    if(success){
                        success(data);
                    }
                },
                error: function () {
                    if(error){
                        error(data);
                    }
                }
            }); //ajaxsubmit
        }//addDevDataModel

        /*----------------------------提交设备信息获取id-------------------------------*/
        var thisData = getInputName("#addDevice");

        addDevInfo(thisData,function (data) {
            alert("上传设备类型成功")

            var data1 = JSON.parse(data);
            var dataModelId = data1.dataModelId;
            var  firmwareData = {
                "dataModelId": dataModelId
            };
            var pluginId = $("#tablePlugin").val();
            var pluginData = {"pluginId": pluginId, "dataModelId": dataModelId};

            addDevFirmware(firmwareData,function () {
                    alert("上传固件成功")
            },function () {
                alert("上传固件失败")
            });
            addDevPlugin(pluginData,function (data) {

                alert("上传插件成功")
            },function () {
                alert("上传插件失败")
            });
            addDevDataModel(firmwareData,function () {

                alert("上传dataModel成功")
            },function () {
                alert("上传dataModel失败")
            });

        },function () {
            alert("上传设备类型失败")

        });



        function  back() {


        $.ajax({
            type: "post",
            url: addDeviceUrl,
            data: thisData,
            async: true,
            cache: false,
            success: function (data) {
//alert("1成功");
                /*----------------上传dataModel文件----------------*/
                var data1 = JSON.parse(data);
                var dataModelId = data1.dataModelId;
                $("#addDataModel").ajaxSubmit({
                    type: 'post',
                    url: addDataModelUrl,
                    cache: false,
                    data: {
                        "dataModelId": dataModelId
                    },
                    success: function (data) {
//alert("2成功");
                        /*--------------选择插件----------------*/
                        var pluginId = $("#tablePlugin").val();

                        var dataP = {"pluginId": pluginId, "dataModelId": dataModelId};
                        $.ajax({
                            type: "post",
                            url: addDevicePluginUrl,
                            data: dataP,
                            async: true,
                            cache: false,
                            success: function (data) {
                                //alert("添加插件成功");
                                /*--------------添加固件------------*/
                                $.ajax({
                                    type: "post",
                                    url: addFirmwareUrl,
                                    cache: false,
                                    data: {
                                        "dataModelId": dataModelId
                                    },
                                    async: true,
                                    success: function (data) {
                                        //alert("添加成功");
                                        var sure = confirm("添加成功继续上传?");
                                        if (sure) {
                                            clearInput();
                                        } else {
                                            history.back();
                                        }

                                    },
                                    error: function () {
                                        alert("添加固件失败　请到详情页修改");
                                    },
                                    timeout: 3000
                                });

                                /*--------------添加固件------------*/
                            },
                            error: function () {
                                alert("添加插件失败");
                            },
                            timeout: 2000
                        });

                        /*---------------选择插件---------------*/
                    },
                    error: function () {
                        alert("添加dataModel &&　插件失败　请到详情页修改");
                    }
                }); //ajaxsubmit
                /*--------------------------------*/

            },//success
            error: function () {
                alert("添加设备类型信息 && 插件 && dataModel失败");
            }
        });//deviceAjax
        }//back

    }//submitDevice


}
/*---------------------------------设备详情/固件----------------------------------------*/
function deviceDetail() {

    //获取上页传值

     var  data = getStorage("deviceDataStr");



//alert(data);
    var deviceData = JSON.parse(data);

    var firmwareId = deviceData['firmwareId'];
    var dataModelId = deviceData['dataModelId'];
    //alert(dataModelId);
    //alert(firmwareId);
    /*--------------------------------------获取所有插件供选择----------------------------------------------*/
    $.ajax({
        type: "get",
        url: allPluginUrl,
        async: true,
        cache: false,
        success: function (data) {
            //alert(data);
            var data1 = JSON.parse(data);
            var arr = data1.values;
            addCell("#tablePlugin", "#cellPlugin", arr, "pluginName");

            /*判断是否已经选择插件*/
            var pluginId = deviceData["pluginId"];
            if (pluginId != "null") {
                $("#cellPlugin").text("已经上传插件");
            } else {
                $("#cellPlugin").text("未上传插件");
            }

            /*判断是否已经选择插件*/

        },
        error: function () {
            alert("加载失败尝试刷新页面");
        }
    }); //ajax

    /*---------------------------------------显示修改设备信息的插件----------------------------------------------*/
    /*-------------------------------获取设备详细信息显示在input中--------------------------------------*/
    for (var key in deviceData) {
        //是否上传dataModel
        if (key == "jsonIsExist") {
            var jsonIsExist = deviceData["jsonIsExist"];
            if (jsonIsExist == "1") {
                $(".jsonIsExist").text("已经上传");
                $(".jsonIsExist").css("color", "orange");
            }
            continue;
        }//大if






        $("#addDevice").find("[name=" + key + "]").val(deviceData[key]);


    }
//表单验证

    checkForm("#addDevice", "#changeDevBtn", {
        name: "required",
        manufacture: "required",
        manufactureDataModelId: {
            required: true,
            number: true,
        }
    }, {
        name: "请输入设备名称",
        manufacture: "请输入厂商名",
        manufactureDataModelId: {
            required: "请输厂商数据模型ID",
            number: "厂商数据模型ID必须为数字"
        },

    }, function (form) {

        submitDeviceDetail();

    });

    /*-------------------------------------------修改设备类型函数--------------------------------------------*/

    function submitDeviceDetail() {
        var thisdata = getInputName("#addDevice");

        thisdata.dataModelId = dataModelId;

        $.ajax({
            type: "post",
            url: changDataModel,
            async: true,
            cache: false,
            data: thisdata,
            success: function (data) {
                alert("修改设备类型成功");
            },
            error: function () {
                alert("修改设备类型失败");
            },
            timeout: 3000
        });


//修改plugin
        var pluginId = $("#tablePlugin").val();
        changeData = {"pluginId": pluginId, "dataModelId": dataModelId};
        $.ajax({
            type: "post",
            url: addDevicePluginUrl,
            async: true,
            data: changeData,
            cache: false,
            success: function (data) {
                alert("修改插件成功");
            },
            error: function () {
                alert("修改插件失败");
            },
            timeout: 3000
        });
        //修改plugin结束
    }//submitDeviceDetail
    /*-------------------------------------------上传dataModeljson文件--------------------------------------------*/

    $("#uploadDataModelBtn").on("click", function () {
        if ($(".file").val() == "") {
            alert("请选择文件");
            return;
        }
        upload($(".file")[0], function (result) {



            if (!strIsJson(result)) {
                alert("文件格式错误,必须为json格式");
            } else {

                $("#addDataModel").ajaxSubmit({
                    type: 'post',
                    url: addDataModelUrl,
                    cache: false,
                    data: {
                        "dataModelId": dataModelId
                    },
                    success: function (data) {
                        alert("success");
                    },
                    error: function () {
                        alert("修改失败");
                    }
                });//ajax
            }//els

        });


    });//click
    /*-------------------------------------------查询固件版本-----------------------------------------------------*/


    var data = {"firmwareId": firmwareId};
    $.ajax({
        type: "post",
        url: queryFirmwareVersionUrl,
        async: true,
        data: data,
        cache: false,
        success: queryFirmwareVersionSuccess,
        error: function () {
            alert("查询固件版本失败");
        },
        timeout: 3000
    });

    function queryFirmwareVersionSuccess(data) {
        //alert(data);
        //alert("查询固件版本成功");
        var data1 = JSON.parse(data);
        var arr = data1.values;
        var publishVersion = data1.publishVersion;
        var firmwareId = data1.firmwareId;

        addCell2("#tableFirmware", "#cellFirmware", arr, publishVersion);

        /*--------------------------------------删除固件版本----------------------------*/
        $(".pluginDelete").on("click", function () {
            if ($(this).text() == "在线") {
                alert("在线版本不可操作!");

                return;
            }
            var version = $(this).parent().siblings("[name='version']").text();
            //alert(version);
            var thisdata = {
                "firmwareId": firmwareId,
                "version": version
            };
            var sure = confirm("确定删除");
            if (sure) {
                clearInput();
                $.ajax({
                    type: "post",
                    url: deleteFirmwareVersionUrl,
                    async: true,
                    data: thisdata,
                    cache: false,
                    success: function () {
                        alert("删除固件版本成功");
                        window.location.reload();
                    },
                    error: function () {
                        alert("删除失败!");
                    }

                });//ajax
            }//if
        });
        /*三：---------------------------------发布固件版本----------------------------------*/
        //加载固件列表
        addCell("#addfirmwareSelect", "#addfirmwareCell", arr, "version");

        $(".addfirmwareBtn").on("click", function () {
            var version = $("#addfirmwareSelect").val();
            //alert(version);

            if ($("#addfirmwareSelect").prop("selectedIndex") == 0) {
                alert("请选择需要发布的固件版本");
                return;
            }
            var sure = confirm("确定发布?");
            if (sure) {
                clearInput();
                var thisdata = {
                    "firmwareId": firmwareId,
                    "version": version
                };
                $.ajax({
                    type: "post",
                    url: publishFirmwareVersionUrl,
                    async: true,
                    data: thisdata,
                    cache: false,
                    success: function () {
                        alert("发布成功!");
                        window.location.reload();
                    },
                    error: function () {
                        alert("发布失败请重试!");
                    }
                });
            } //if
        });
    }//firmwaresuccess

}//deviceDetail


/*------------------------------四:添加固件版本-----------------------------------*/


function addFirmwareVersion() {

    //var deviceDataStr = window.sessionStorage.deviceDataStr;
    var deviceDataStr = getStorage("deviceDataStr");

    var dataJson = JSON.parse(deviceDataStr);
    var firmwareId = dataJson["firmwareId"];
//alert(firmwareId);

    checkForm("#addVersionForm", ".inputSubmit", {
        version: {
            required:true,
            remote:{
            url:firmwareVersionIsOk,
                type:"Post",
                data:{
                    version:$(".inputname").val(),
                    firmwareId:firmwareId
                }
        }
        },
        md5: "required",
        versionDesc:"required",
        thumbnail:{required:true
        }
    }, {
        version:{
            required:"请输入版本号",
            remote:"版本号已经存在"
        } ,
        md5: "请输入md5值",
        versionDesc: "请填写描述",
        thumbnail:"请选择固件"

    }, function (form) {

      addFirmwareVersion();

    });


   function addFirmwareVersion() {
        $("#addVersionForm").ajaxSubmit({
            type: 'post',
            url: addFirmwareVersionUrl,
            cache: false,
            data: {
                "firmwareId": firmwareId
            },
            success: function (data) {
                var sure = confirm("上传成功继续上传?");
                if (!sure) {
                    history.back();
                }
                clearInput();
            },
            error: function () {
                alert("失败");
            }
        }); //ajax
    } //submitfirmware
} //addPluginVersion
/*-----------------------------------统计status-------------------------------------------------------*/

function status() {

    //alert(getStorage("userName"));

    $.ajax({
        type: "get",
        url: getStatusUrl,
        async: true,
        cache: false,
        success: statusCallBack,
        error: function () {
            alert("查询基本信息失败!");
        },
        timeout: 3000
    });


    function statusCallBack(data) {


        var json = JSON.parse(data);
        var arr = json.values;

        for (var i = 0; i < arr.length; i++) {
            var dic = arr[i];
            var cell1 = $("#cell1").clone(true);
            var cell2 = $("#cell2").clone(true);
            cell1.text(dic.name);
            cell2.text(dic.count);
            cell1.show();
            cell2.show();
            $("#table1").append(cell1);
            $("#table2").append(cell2);

        }
    }


}

/*----------------------------------------------------查询红外码库-------------------------------------------------------*/
function lircCode() {
    $.ajax({
        type: "get",
        url: allCodeUrl,
        async: true,
        cache: false,
        success: allCodeCallBack,
        error: function () {
            alert("查询红外码库失败!");
        },
        timeout: 3000
    });
/*
    var data = {
     "ret":0,
"values":[
        {
            "id":"1",
"version": "V1.0.1",
},
    {
    "id":"2",
    "version": "V1.0.2",
    }
]
};*/
function allCodeCallBack(data) {
    if(typeof data == "string"){
        data = JSON.parse(data);
    }


    var  arr = data.values;
    addCell("#table", "#cell", arr, null)

    /*----------------------------------------------------删除红外码库-------------------------------------------------------*/
    $(".pluginDelete").on("click",function() {
        var version =  $(this).parents("#cell").find("[name = version]").text();
        //alert(version);
        $.ajax({
            type: "post",
            url: deleteCodeUrl,
            async: true,
            data: {
                version:version
            },
            cache: false,
            success: function () {
                alert("删除成功");
                window.location.reload();
            },
            error: function () {
                alert("删除失败!");
            }
        });//ajax
    });




}



}//lircCode

/*----------------------------------------------------添加红外码库-------------------------------------------------------*/
function  addCode1() {

    checkForm("#addPluginForm", ".inputSubmit", {
        version: {
            required:true/*,
            remote:{
                url:firmwareVersionIsOk,
                type:"Post",
                data:{
                    version:$(".inputname").val(),
                    firmwareId:firmwareId
                }
            }*/
        },
        thumbnail:{required:true
        }
    }, {
        version:{
            required:"请输入版本号",
            /*remote:"版本号已经存在"*/
        } ,
        thumbnail:"请选择红外吗库"
    }, function (form) {
        codeSubmit();
    });

function  codeSubmit() {

    $("#addPluginForm").ajaxSubmit({
        type: 'post',
        url: addCodeUrl,
        cache: false,
        data: {
        },
        success: function (data) {
            var sure = confirm("上传成功继续上传?");
            if (!sure) {
                history.back();
            }
            clearInput();
        },
        error: function () {
            alert("失败");
        },
        timeout:3000
    }); //ajax
}

}//addCode1

/*----------------------------------------------------红外设备-------------------------------------------------------*/
function lircDevice() {
    var dev =  [{"devType":"空调"},{"devType":"电视机"},{"devType":"机顶盒/卫星"},{"devType":"插座"},{"devType":"投影仪"},
        {"devType":"互联网盒子"},{"devType":"DVD"},{"devType":"功放"},{"devType":"相机"},{"devType":"风扇"},
        {"devType":"红外开关"},{"devType":"热水器"},{"devType":"空气净化器"}];

    addCell("#table", "#cell", dev, null);

    //传递参数
    $(".detailBtn").on("click",function () {
       var devType = $(this).parents("#cell").find("[name=devType]").text();
        window.sessionStorage.devType = devType;
    });
}

/*----------------------------------------------------红外设备详情-------------------------------------------------------*/
function  lircDeviceDetail() {
   var data = {
    'ret':0,
    'devType' : 'TV',
    'values':[
        {
            'lircId':'1',
    'manufacture': 'CHANGHONG',
    'modelName':['xxxx', 'xxxxx']
    },
        {
        'lircId':'1',
        'manufacture':'SAMSUNG',
        'modelName':['xxxx', 'xxxxx']
        }
        ,
        {
            'lircId':'1',
            'manufacture':'SAMSUNG',
            'modelName':['xxxx', 'xxxxx']
        }

    ]
    };
var devType =  window.sessionStorage.devType;


    $.ajax({
        type: "post",
        url: allDevUrl,
        async: true,
        data: {
            devType:devType
        },
        cache: false,
        success: detailCallBack,
        error: function () {
            alert("删除失败!");
        }
    });//ajax

function detailCallBack(data) {
   // alert(data);
    if(typeof data == "string"){
        data = JSON.parse(data);
    }

    var arr = data.values;
    for(var i = 0; i < arr.length; i++){
        var dic = arr[i];
        var cell = $("#cell").clone().show();
        for (var  key in dic){

            //添加index
       /*     if(key == "manufacture"){
                var index = i + 1;
                $(cell).find("[name=" + key + "]").text(index+" : "+dic[key]);
            }else{*/
                $(cell).find("[name=" + key + "]").text(dic[key]);
            /*}*/
        }
        $("#table").append(cell);
        var cell2 = $("#cell2").clone().show();
        var arr2 = dic.modelName;
        for(var j = 0 ; j < arr2.length; j++){
            var  cell3 = $("#secondCell").clone();
            $(cell3).find(".model").text(arr2[j]);
            cell3.show();
            // alert(cell3.html());
            $(cell2).find("#secondTable").append(cell3);
            //alert($(cell2).find("#secondTable").text());
        }
        $("#table").append(cell2);
    }//for i
    /*--------------------------------------------------删除红外设备--------------------------------------------------------*/
    $(".modelDel").on("click",function () {
       var confirm1 = confirm("确定删除?");
        if(confirm1){

            var devType = window.sessionStorage.devType;
            var manufacture = $(this).parents("#cell2").prev("#cell").find("[name = manufacture]").text();
            var modelName = $(this).prev().text();

            //alert(devType+manufacture+modelName);
            var thisData = {
                devType:devType,
                manufacture:manufacture,
                modelName:modelName
            }
            $.ajax({
                type: "post",
                url: devDeleteUrl,
                async: true,
                data:thisData,
                cache: false,
                success: function (data) {
                    alert("删除成功.");
                    window.location.reload();
                },
                error: function () {
                    alert("删除失败!");
                }
            });//ajax




        }
    });


}//lircdeviceDetail


}



/*---------------------------------------------------添加红外设备--------------------------------------------------------*/
function addLircDevice() {
    var dev =  [{"devType":"空调"},{"devType":"电视机"},{"devType":"机顶盒/卫星"},{"devType":"插座"},{"devType":"投影仪"},
        {"devType":"互联网盒子"},{"devType":"DVD"},{"devType":"功放"},{"devType":"相机"},{"devType":"风扇"},
        {"devType":"红外开关"},{"devType":"热水器"},{"devType":"空气净化器"}];
    //获取设备型号
    addCell4("#tableDevType", "#cellDevType", dev);



    checkForm("#addPluginForm", ".inputSubmit", {
        devType: {
            required:true/*,
             remote:{
             url:firmwareVersionIsOk,
             type:"Post",
             data:{
             version:$(".inputname").val(),
             firmwareId:firmwareId
             }
             }*/
        },
        manufacture:"required",
        modelName:"required",
        thumbnail:{required:true
        }
    }, {
        devType:{
            required:"请选择设备类型",
            /*remote:"版本号已经存在"*/
        } ,
        modelName:{
            required:"请输入设备型号",
        },
        manufacture:{
          required:"请输入厂商"
        },
        thumbnail:"请选择红外吗库"
    }, function (form) {
        devAddSubmit();
    });

    function  devAddSubmit() {

        $("#addPluginForm").ajaxSubmit({
            type: 'post',
            url: devAddUrl,
            cache: false,
            data: {
            },
            success: function (data) {
                var sure = confirm("上传成功继续上传?");
                if (!sure) {
                    history.back();
                }
                clearInput();
            },
            error: function () {
                alert("失败");
            },
            timeout:3000
        }); //ajax
    }
}//addLircDevice


