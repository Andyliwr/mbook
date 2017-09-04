<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">微书后台登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin } from '../api/api';
  import { cookie, Base64 } from '../common/js/util';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        let self = this;
        self.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            self.logining = true;
            //NProgress.start();
            let loginParams = { username: self.ruleForm2.account, password: self.ruleForm2.checkPass };
            requestLogin(loginParams).then(data => {
              self.logining = false;
              //NProgress.done();
              let tokenid = data.id;
              let userid = data.userId;
              if (tokenid && userid) {
                // judge isChecked
                cookie.setCookie('access_token', tokenid, 1);
                localStorage.setItem('userid', userid);
                if(self.checked){
                  let base64 = new Base64();
                  let username = base64.encode(self.ruleForm2.account);
                  let password = base64.encode(self.ruleForm2.checkPass);
                  localStorage.setItem('loginInfo', JSON.stringify({name: username, pwd: password}));
                }
                // go to index
                self.$router.push({ path: '/main' });
              } else {
                self.$message({
                  message: '用户名或密码错误',
                  type: 'error'
                });
              }
            }).catch(err => {
              console.log(err);
              self.$message({
                message: '登陆失败',
                type: 'error'
              })
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    watch: {
      checked(curValue, oldValue){
        // update checked value
        localStorage.setItem('remenberPwd', curValue);
      }
    },
    created: function () {
      let self = this;
      // set remenberPwd
      let remenberPwd = localStorage.getItem('remenberPwd');
      if(remenberPwd === null){
        // if remenberPwd is not existed, use is enter system the first time, set remenberPwd true
        localStorage.setItem('remenberPwd', true);
      }else if(remenberPwd === 'false'){
        // use user last setting
        this.checked = false;
      }else if(remenberPwd === 'true'){
        // read user and pwd from localStorage
        localStorage.setItem('remenberPwd', true);
        let loginInfo = localStorage.getItem('loginInfo');
        if(loginInfo){
          let {name, pwd} = JSON.parse(loginInfo);
          let base64 = new Base64();
          this.ruleForm2 = {account: base64.decode(name), checkPass: base64.decode(pwd)};
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
