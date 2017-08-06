//cookie最后生成的格式为
// 'name=value;expires=时间值;path=路径值;domain=域值;secure'

//设置cookie
function setCookie(name, value, expires) {
	//alert('setCookie');

	//获取该函数的参数。
	var argv = setCookie.arguments;

	//获取该函数参数的个数。
	var argc = setCookie.arguments.length;
	
	//设置超时时间,如果没有传参数则设置为null。
	var expires = (argc > 2) ? argv[2] : null;
	
	//设置cookie路径，没有传参数则设置为null。
	var path = (argc > 3) ? argv[3] : null;

	//设置域，没有传参数则设置为null。
	var domain = (argc > 4) ? argv[4] : null;

	//设置安全东东，没有传参数则设置为null。
	var secure = (argc > 5) ? argv[5] : null;

	document.cookie = name + '=' + escape(value) + 
	((expires == null) ? '' : (';expires=' + expires.toGMTString())) + 
	((path == null) ? '' : (';path=' + path)) + 
	((domain == null) ? '' : (';domain=' + domain)) + 
	((secure == null) ? '' : ';secure');

}



//获取cookie的值
// 'name=value;expires=时间值;path=路径值;domain=域值;secure'
function getCookie(name) {
	if (document.cookie.length > 0) {
		var start_name = document.cookie.indexOf(name + '=');
		if (start_name != -1) {
			var start_value = start_name + name.length + 1;
			var end_value = document.cookie.indexOf(';', start_value);
			if (end_value == -1) {
				end_value = document.cookie.length;
			}
			return unescape(document.cookie.substring(start_value, end_value));
		}
	}
	return null;
}




//清除cookie，使cookie过期
function clearCookie(name) {
	var expdate = new Date();
	setCookie(name, null, expdate);
}


