import Vue from 'vue'
// 导入ui模块
  // 按钮，表单，表单图标，输入框
import { Button, Form, FormItem, Input } from 'element-ui'
  // 布局容器组件
import { Container, Header, Aside, Main } from 'element-ui'
  // 侧边栏菜单栏组件
import { Menu, Submenu, MenuItem} from 'element-ui'
  // 导入弹框提示组件
import { Message } from 'element-ui'

// 全局注册
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
// 不同之处：需要全局挂载，这样 $message 就是 Message 的别名
Vue.prototype.$message = Message
