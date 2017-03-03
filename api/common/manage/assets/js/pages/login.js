window.onload = function(){
	var base64 = new Base64();
	if((localStorage.getItem('rememberName') == '1')){
		var usernameSaved = base64.decode(getCookie('username'));
		var pwd = base64.decode(getCookie('username'));
		var passwordSavedLen = pwd.length;
		//不给前端传真值
		var passwordSaved = '';
		for(var i=0; i<passwordSavedLen; i++){
			passwordSaved += '1';
		}
		$("input[name='rememberName']").attr('checked', true);
	}
	$ ('#login-btn').click(function(){
		var username = '';
		var password = '';
		if((localStorage.getItem('rememberName') == '1') && passwordSaved && usernameSaved){
			username = usernameSaved;
			password = pwd;
		}else{
			username = $("input[name='username']").val();
			password = $("input[name='password']").val();
		}
		$('.login.error-tip').css({'display':'none'});
		if (username.length >=6 && password.length >= 6){
			var loginUrl = API_URL+ '/Users/login';
			var postData={"username":username , "password":password};
			$.ajax({
				type:'POST',
				url:loginUrl,
				data:postData,
				timeout:10000,
				success:function(data){
					setCookie('token', data.id);
					setCookie('userid', data.userId);
					//判断用户
					if((localStorage.getItem('rememberName') == '1')){
						setCookie('username', username, 7);
						setCookie('password', password, 7);
					}
					window.location.href = "index.html?userid="+data.userId;
				},
				error:function(err){
					$('.error-tip').html(err.responseJSON.error.message+' ,请输入正确的用户名或密码').css({'display':'block'});
				}
			});
		}else{
			$('.error-tip').css({'display':'block'});
			$("input[name='username']").focus();
		}
	});

	//记住密码功能
	$("input[name='rememberName']").click(function(){
		if($(this).is(':checked')){
			localStorage.setItem('rememberName', 1);
		}else{
			localStorage.setItem('rememberName', 0);
		}
	});
};