<template>

  <el-container class="home_container">

    <!-- 头部区 -->
    <el-header>
      <div> <!-- 图片 -->
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>

      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 按钮实现折叠展开 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF" :default-active="this.$route.path" unique-opened
          :collapse="isCollapse" :collapse-transition="false" router> <!--
                                                                  unique规定是否可以展开多个菜单
                                                                  collapse 折叠菜单
                                                                  router 为菜单开启路由模式
                                                                      -->
          <!-- 1级菜单 --> <!-- index 动态数据绑定，否则所有的以及菜单都会被绑在一起，牵一发而动全身-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!-- 1级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 根据item.id和iconsObj（Map)获取-->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 使用item从后端接口获得的-->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
              @click="saveNavState('/' + subItem.path)">
                <template>
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>

          </el-submenu>
        </el-menu>

      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main> <!-- 路由占位符，放置子组件 -->
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>

</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },

  created () {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath")
  },

  methods: {
    logout() {
      // 清空token,然后重定向
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      // 根据接口获取左侧菜单的数据，这里需要带着token（main.js）中设置了
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status != 200)
        return this.$message.error(res.meta.msg)
      // 获取到的data里面就是一级菜单，赋给 menulist
      this.menulist = res.data
      console.log(res)
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 点击子路由，会存储活跃路由
    saveNavState(activePath) {// 保存链接的激活状态，并且设置为高亮路径
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }

}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
  margin: 0;
  padding: 0;
}
// 头部样式，直接绑定布局的分布名
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center; // 这让按钮居中，而不是上下贴边
  color: white; // 设置字
  font-size: 20px;
  > div { // 嵌套设置里面的 div
    display: flex; // 纵向居中
    align-items: center;
    span {
      margin-left: 15px; // 外左边距
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;

      .el-menu-item{
        padding-right: 10px;
        padding-left: 50px;
      }
  }
}


.el-main {
  background-color: #eaedf1;
}


// 每个图标都有一个 i.iconfont 类，由此可以定义其样式
.iconfont {
  margin-right: 10px; // 图标和字符间距
}

// 折叠按钮样式
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>
