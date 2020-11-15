import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标样式表
import './assets/fonts/iconfont.css'
// 配置axios
import axios from 'axios'
  // 配置请求的根路径，那所有的请求都可以只写子路径了
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  // 全局挂载
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
