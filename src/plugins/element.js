import Vue from 'vue'
// 导入ui模块
import { Button, Form, FormItem, Input } from 'element-ui'
import { Message } from 'element-ui' // 导入弹框提示组件

Vue.use(Button, Form, FormItem, Input)
// 不同之处：需要全局挂载
Vue.prototype.$message = Message
