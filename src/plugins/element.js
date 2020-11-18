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
  // 面包屑导航
import { Breadcrumb, BreadcrumbItem } from 'element-ui'
  // 卡片区
import { Card, Row, Col} from 'element-ui'
  // Table用户表格区
import { Table, TableColumn, Switch, Tooltip } from 'element-ui'
  // 页面
import { Pagination } from 'element-ui'
  // 对话框
import { Dialog } from 'element-ui'
  // 确认对话框
import { MessageBox } from 'element-ui'
  // 下拉选择模块
import { Select, Option} from 'element-ui'

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

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.use(Card)
Vue.use(Row)
Vue.use(Col)

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)

Vue.use(Pagination)
Vue.use(Dialog)

Vue.use(Select)
Vue.use(Option)
// 不同之处：需要全局挂载，这样 $message 就是 Message 的别名
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
