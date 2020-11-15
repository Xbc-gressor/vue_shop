<template>
  <div class="login_container">
    <div class="login_box">

      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区 --><!-- ref代表表单，可根据loginRef获取表单实例对象，v-model绑定数据，rules&prop实现表单验证-->
      <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login_form">
        <el-form-item prop="username"> <!-- 用户名 -->
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" ></el-input>
        </el-form-item>
        <el-form-item prop="password"> <!-- 密码 -->
          <el-input  type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="goLogin" round>登录</el-button>
          <el-button type="info" @click="resetForm" round>重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  // 数据
  data () {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象

      loginRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    // 点击验证登录
    goLogin(){ // 表单函数之一，参数为回调函数，发生在验证后
      this.$refs.loginRef.validate(async (valid) => {
        // await必须要async，好像也可以用.then？
        // 请求登录
        if(!valid) return;
        // const result = await this.$http.post("/login", this.loginForm);
        // 通过{}解构，并判断是否登录成功
        const {data: res} = await this.$http.post("/login", this.loginForm);
        if (res.meta.status != 200)
          return this.$message.error("用户名或密码错误！")

        /* 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
             1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
             1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
         */
        window.sessionStorage.setItem('token', res.data.token)
        // 通过编程式导航跳转到后台主页，路由地址是 /home
        await this.$router.push('/home')
        return this.$message.success("登陆成功！")
      })
    },
    // 点击重置按钮，实现重置
    resetForm(){
      // 通过ref直接获得表单的引用对象，再使用element文档中的表单函数
      this.$refs.loginRef.resetFields();
    },
  }
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  // 撑满全屏
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: cadetblue;
  border-radius: 3px;
  // 移到中间
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  // 语法嵌套
  .avatar_box{
    height: 130px;
    width: 130px;
    // 设置边框
    border: 1px solid #eee; // 宽度颜色
    border-radius: 50%;     // 圆角曲率
    box-shadow: 0 10px 20px;// 模糊阴影
    padding: 10px;    // 内边距
    // 移动距离
    position: absolute;
    left: 50%;
    top: 0%;
    transform: translate(-50%, -50%);
    // 背景颜色
    background-color: cadetblue;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: darkgray;
    }
  }

  // 登录表单
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  // 按钮
  .btns{
    // 弹性布局
    display: flex;
    justify-content: flex-end;
  }
}
</style>
