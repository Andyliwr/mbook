window.onload = function () {
  if ($.cookie('token')) {
    // window.location.href = 'index.html';
  }
  var base64 = new Base64();
  if ((localStorage.getItem('rememberName') == '1')) {
    var usernameSaved = base64.decode($.cookie('username'));
    var pwd = base64.decode($.cookie('password'));
    var passwordSavedLen = pwd.length;
    //不给前端传真值
    var passwordSaved = '';
    for (var i = 0; i < passwordSavedLen; i++) {
      passwordSaved += '1';
    }
    $("input[name='rememberName']").attr('checked', true);
    $("input[name='username']").val(usernameSaved);
    $("input[name='password']").val(passwordSaved);
  }
  $('#login-btn').click(function () {
    var username = '';
    var password = '';
    if ((localStorage.getItem('rememberName') == '1') && passwordSaved && usernameSaved) {
      username = usernameSaved;
      password = pwd;
    } else {
      username = $("input[name='username']").val();
      password = $("input[name='password']").val();
    }
    $('.login.error-tip').css({'display': 'none'});
    if (username.length >= 5 && password.length >= 6) {
      var loginUrl = API_URL + '/adminUser/login';
      var postData = {"username": username, "password": password};
      $.ajax({
        method: 'post',
        url: loginUrl,
        data: postData,
        timeout: 10000,
        success: function (data) {
          $.cookie('adminUserToken', data.id, {expires: 7});
          $.cookie('userid', data.userId, {expires: 7});
          //判断用户
          if ((localStorage.getItem('rememberName') == '1')) {
            $.cookie('username', base64.encode(username), {expires: 7});
            $.cookie('password', base64.encode(password), {expires: 7});
          }
          var backUrl = getParaByName('backUrl');
          if(backUrl){
            window.location.href = backUrl;
          }else{
            window.location.href = "index.html";
          }

        },
        error: function (err) {
          $('.error-tip').html('登录失败，请输入正确的用户名或密码').css({'display': 'block'});
        }
      });
    } else {
      $('.error-tip').css({'display': 'block'});
      $("input[name='username']").focus();
    }
  });

  //记住密码功能
  $("input[name='rememberName']").click(function () {
    if ($(this).is(':checked')) {
      localStorage.setItem('rememberName', 1);
    } else {
      localStorage.setItem('rememberName', 0);
    }
  });


  //注册逻辑
  $('#r-rigster').click(function () {
    $('.r-errorTips').hide();

    var username = $('input[name="r-username"]').val();
    var email = $('input[name="r-email"]').val();
    var password = $('input[name="r-password"]').val();
    var password2 = $('input[name="r2-password"]').val();

    var emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    var usernameReg = /^[a-zA-z]\w{3,15}$/; // 4-16位
    var passwordReg = /^[a-zA-Z\d_]{6,}$/; //最少8位

    if (emailReg.test(email)) {
      if (usernameReg.test(username)) {
        if (passwordReg.test(password)) {
          if (password == password2) {
            if ($('#isAgreen').is(':checked')) {
              //将注册按钮的字标改成loading
              $(this).html('<i class="icon-spinner"></i>');
              //全部通过，发送ajax
              var registeUrl = API_URL + '/user';
              var postData = {"username": username, "email": email, "password": password, "emailVerified": false};
              $.ajax({
                type: 'POST',
                url: registeUrl,
                data: postData,
                timeout: 10000,
                success: function (data) {
                  $(this).html('<i class="icon-circle-blank"></i>&nbsp;注册成功');
                  setTimeout(function () {
                    window.location.href = "login.html";
                  }, 3000);
                },
                error: function (err) {

                }
              });
            } else {
              $('.r-errorTips').html('您尚未点击同意注册协议').show();
            }
          } else {
            $('.r-errorTips').html('两次输入密码不一致').show();
            $('input[name="r2-password"]').focus();
          }
        } else {
          $('.r-errorTips').html('请输入的最少8位，由字母或者下划线组成的密码').show();
          $('input[name="r-password"]').focus();
        }
      } else {
        $('.r-errorTips').html('请输入的4-16位的用户名').show();
        $('input[name="r-username"]').focus();
      }
    } else {
      $('.r-errorTips').html('邮箱格式错误').show();
      $('input[name="r-email"]').focus();
    }

  });
};
