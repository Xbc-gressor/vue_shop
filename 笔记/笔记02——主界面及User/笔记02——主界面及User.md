### 今日目标

1.实现后台首页的基本布局
2.实现左侧菜单栏
3.实现用户列表展示
4.实现添加用户

​	

## 1. `axios`请求拦截器

后台除了登录接口之外，都**需要token权限验证**，我们可以通过**添加`axios`请求**拦截器来添加token，以保证拥有获取数据的权限
在main.js中添加代码，在将`axios`挂载到`vue`原型之前添加下面的代码

```javascript
/* main.js */
//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config=>{
  //为请求头对象，添加token验证的Authorization字段，带着token请求
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
```



## 2. 后台首页布局

### 1) 实现页面宏观布局

1. **打开`Home.vue`组件，进行布局：** ==—— Container布局容器 ——==

```vue
<el-container class="home-container">
  <!-- 头部区域 -->
  	<el-header>Header
		<el-button type="info" @click="logout"> 退出 </el-button>
	</el-header>
  <!-- 页面主体区域 -->
  	<el-container>
      <!-- 侧边栏 -->
    	<el-aside width="200px">Aside</el-aside>
      <!-- 主体结构 -->
    	<el-main>Main</el-main>
  	</el-container>
</el-container>
```

2. 添加样式

    默认情况下，跟element-ui组件同名的类名可以帮助我们快速的给对应的组件添加样式，如：

```css
.home-container {
  height: 100%;
}
.el-header{
  background-color:#373D41;
}
.el-aside{
  background-color:#333744;
}
.el-main{
  background-color:#eaedf1;
}
```



### 2) 实现左侧菜单栏文本图标

​		**1. 请求侧边栏数据**

```javascript
<script>
export default {
	data() {
        return {
            // 左侧菜单数据
            menuList: []
        }
    },
	created() {
        // 在created阶段触发请求左侧菜单数据
        this.getMenuList()
    },
	methods: {
    	logout() {
      		window.sessionStorage.clear()
          	this.$router.push('/login')
      	},
        async getMenuList() {
            // 带着token，发送请求获取左侧菜单数据
            const { data: res } = await this.$http.get('menus')
            if (res.meta.status !== 200) // 请求失败，打印信息 
                return this.$message.error(res.meta.msg)
            // 请求成功，获得的data包含了后端提供的菜单栏的信息
            this.menuList = res.data
        }
    }
}
</script>
```
​		**2. 通过`v-for`双重循环渲染左侧菜单** ==——menu、submenu、menu-item——==

```javascript
<el-menu
  background-color="#333744"
  text-color="#fff"
  active-text-color="#ffd04b">
  <!-- 一级菜单 -->
  <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
    <!-- 一级菜单模板 -->
    <template slot="title">
      <!-- 图标 -->
      <i class="el-icon-location"></i>
      <!-- 文本 -->
      <span>{{item.authName}}</span>
    </template>
    <!-- 二级子菜单 -->
    <el-menu-item :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
      <!-- 二级菜单模板 -->
      <template slot="title">
        <!-- 图标 -->
        <i class="el-icon-location"></i>
        <!-- 文本 -->
        <span>{{subItem.authName}}</span>
      </template>
    </el-menu-item>
  </el-submenu>
</el-menu>
```

​		**3.设置激活子菜单样式**

* 通过更改el-menu的`active-text-color`属性可以设置侧边栏菜单中点击的激活项的文字颜色
* 通过更改菜单项模板（template）中的`i`标签的类名，可以将左侧菜单栏的图标进行设置，我们需要在项目中使用第三方字体图标
    1. 在数据中添加一个图标名称字典`iconsObj`：

```javascript
iconsObj: {
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      }
```
​		2. 然后将图标类名进行数据绑定，绑定`iconsObj`中的数据：

* 为了**保持左侧菜单每次只能打开一个**，显示其中的子菜单，我们可以在`el-menu`中添加一个属性`unique-opened`
    或者也可以数据绑定进行设置(此时true认为是一个bool值，而不是字符串) :unique-opened="true"

    

### 3）制作侧边菜单栏的伸缩功能

1. 在菜单栏上方添加一个div

```vue
        <!-- 侧边栏,宽度根据是否折叠进行设置 -->
        <el-aside :width="isCollapse ? '64px':'200px'">
          <!-- 伸缩侧边栏按钮 -->
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单，:collapse="isCollapse"（设置折叠菜单为绑定的 isCollapse 值），:collapse-transition="false"（关闭默认的折叠动画） -->
          <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          ......
```
2. 动态设置侧边栏的宽度

```vue
<!-- 侧边栏 -->
<el-aside :width="isCollapse ? '64px' : '200px'">
```



## 3.在后台首页添加子级路由
### 1)放置跳转路由

**A. 在主体位置，放置子级路由组件占位**

1. 新增子级路由组件`Welcome.vue`

2. 在router.js中导入子级路由组件，并设置路由规则以及子级路由的默认重定向

    ```javascript
    {
        path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users }
            ]
    }
    ```

    

3. 打开`Home.vue`，在main的主体结构中添加一个路由占位符，之后**将子组件加载到这个地方**

    ```vue
    <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
    </el-main>
    ```

    那么打开页面以后，主体结构部分会显示`Welcome`组件的内容

**B. 侧边栏放置子路由链接**

1. 将`el-menu的router`属性设置为`true`，此时当我们点击二级菜单的时候，就会根据菜单的`index`属性进行路由跳转,如: /110,

```vue
<!-- 侧边栏菜单区域 -->
<el-menu ...... router> <!-- router开启路由模式 -->
```

2. 使用index id来作为跳转的路径不合适，我们可以重新绑定index的值为  `:index="'/'+subItem.path"`path的值来自后端数据提供

```vue
<!-- 二级菜单 -->
<el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" ......>
```



##  4. 完成用户列表主体区域

### 1) 页面布局

1. 新建用户列表组件  `user/User.vue`
    在index.js中导入子级路由组件`User.vue`，并设置路由规则

2. **让正在被使用的功能高亮显示**

    我们可以通过设置`el-menu`的`default-active`属性来设置当前激活菜单的`index`
    但是default-active属性也不能写死，固定为某个菜单值
    所以我们可以先给所有的二级菜单添加点击事件,并将path值作为方法的参数

    ```javascript
    @click="saveNavState('/'+subItem.path)"
    // 在saveNavState方法中将path保存到sessionStorage中
    saveNavState( path ){
      // 点击二级菜单的时候保存被点击的二级菜单信息
      window.sessionStorage.setItem("activePath",path);
      this.activePath = path;
    }
    ```

    

    然后在数据中添加一个`activePath`绑定数据，并将`el-menu`的`default-active`属性设置为`activePath`
    最后在created中将`sessionStorage`中的数据赋值给`activePath`

    ```javascript
    this.activePath = window.sessionStorage.getItem("activePath")
    ```

    

3. 完成页面    ==——Breadcrumb；Card；Row；Cow——==

    **A.** 使用 **`element-ui`面包屑组件** 完成顶部导航路径（导入组件`Breadcrumb`, `BreadcrumbItem`）
    **B. **使用 `element-ui`**卡片组件** 完成主体表格（导入组件`Card`）
    **C. **此时我们需要使用 **栅格布局** 来划分结构。（导入组件`Row`，`Col`)，然后再使用`el-button`制作添加用户按钮

```vue
<div>
    <h3>用户列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
            <el-col :span="7">
                <el-input placeholder="请输入内容">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input> 
            </el-col>
            <el-col :span="4">
                <el-button type="primary">添加用户</el-button>
            </el-col>
        </el-row> 
    </el-card>
</div>
```





### 2）实现用户界面基本逻辑

**1.  请求用户列表数据**

```vue
<script>
export default {
  data() {
    return {
      //获取查询用户信息的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      //保存请求回来的用户列表数据
      userList:[],
      total:0
    }
  },
  created() { // 页面一创建就要请求数据
    this.getUserList()
  },
  methods: {
    async getUserList() {
      //发送请求获取用户列表数据
      const { res: data } = await this.$http.get('users', {
        params: this.queryInfo
      })
      //如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
      //如果返回状态正常，将请求的数据保存在data中
      this.userList = res.data.users;
      this.total = res.data.total;
    }
  }
}
</script>
```
**2. 将用户列表数据展示**  ==——Table、TableColumn 表格；Switch；Tooltip ——==

​	**A.** 使用 **表格** 来展示用户列表数据，(导入组件`Table`,`TableColumn`)，在渲染展示状态时，会使用**作用域插槽**获取每一行的数据
​	**B.** 再使用 `switch`**开关组件** 展示状态信息(导入组件`Switch`)
而渲染操作列时，也是使用作用域插槽来进行渲染的，
​	**C.** 在操作列中包含了修改，删除，分配角色按钮，当我们把鼠标放到分配角色按钮上时
希望能有一些文字提示，此时我们需要使用**文字提示组件**(导入组件`Tooltip`),将分配角色按钮包含
代码结构如下：

```vue
<!-- 用户列表(表格)区域 -->
<el-table :data="userList" border stripe>
    <el-table-column type="index"></el-table-column>
    <el-table-column label="姓名" prop="username"></el-table-column>
    <el-table-column label="邮箱" prop="email"></el-table-column>
    <el-table-column label="电话" prop="mobile"></el-table-column>
    <el-table-column label="角色" prop="role_name"></el-table-column>
    <el-table-column label="状态">
        <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state"></el-switch>
        </template>
    </el-table-column>
    <el-table-column label="操作" width="180px">
        <template v-slot="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size='mini'></el-button>
            <!-- 分配角色 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size='mini'></el-button>
            </el-tooltip>
        </template>
    </el-table-column>
</el-table>
```



**3. 实现用户列表分页** ==Pagination分页组件==

---

**3.1** 使用**表格**来展示用户列表数据，可以使用**分页组件**完成列表分页展示数据(导入组件`Pagination`)
**3.2** 更改组件中的绑定数据

```vue
<!-- 分页导航区域 
@size-change(pagesize改变时触发) 
@current-change(页码发生改变时触发)
:current-page(设置当前页码)
:page-size(设置每页的数据条数)
:total(设置总页数) -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
```
​	**3.3** 添加两个事件的事件处理函数`@size-change`，`@current-change`
```javascript
handleSizeChange(newSize) {
  //pagesize改变时触发，当pagesize发生改变的时候，我们应该
  //以最新的pagesize来请求数据并展示数据
  //   console.log(newSize)
  this.queryInfo.pagesize = newSize;
  //重新按照pagesize发送请求，请求最新的数据
  this.getUserList();  
},
handleCurrentChange( current ) {
  //页码发生改变时触发当current发生改变的时候，我们应该
  //以最新的current页码来请求数据并展示数据
  //   console.log(current)
  this.queryInfo.pagenum = current;
  //重新按照pagenum发送请求，请求最新的数据
  this.getUserList();  
}
```

​	**3.4** 实现更新用户状态
​		当用户点击列表中的switch组件时，用户的状态应该跟随发生改变。
​		3.4.1 首先监听用户点击switch组件的事件，并将作用域插槽的数据当做事件参数进行传递

```vue
<el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
```


​		3.4.2 在事件中发送请求完成状态的更改

```javascript
async userStateChanged(row) {
  //发送请求进行状态修改
  const { data: res } = await this.$http.put(
    `users/${row.id}/state/${row.mg_state}`
  )
  //如果返回状态为异常状态则报错并返回
  if (res.meta.status !== 200) {
    row.mg_state = !row.mg_state
    return this.$message.error('修改状态失败')
  }
  this.$message.success('更新状态成功')
},
```



**4. 实现搜索功能**

---

添加数据绑定，添加搜索按钮的点击事件(当用户点击搜索按钮的时候，调用`getUserList`方法根据文本框内容重新请求用户列表数据)
当我们在输入框中输入内容并点击搜索之后，会按照搜索关键字搜索，我们希望能够提供一个X删除搜索关键字并重新获取所有的用户列表数据，只需要给文本框添加clearable属性并添加clear事件，在clear事件中重新请求数据即可

```vue
<el-col :span="7">
    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
    </el-input>
</el-col>
```



**5.实现添加用户** ==——Dialog；Form、From-item——==

---

​	**5.1** 当我们点击添加用户按钮的时候，弹出一个**对话框**来实现添加用户的功能（引入`Dialog`组件）

​	**5.2** 接下来我们要为“添加用户”按钮添加点击事件，在事件中将`addDialogVisible`设置为true，即显示对话框

​	**5.3** 布局`Dialog`组件中的内容

```vue
<!-- 对话框组件  :visible.sync(设置是否显示对话框) width(设置对话框的宽度)
:before-close(在对话框关闭前触发的事件) -->
<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
    <!-- 对话框主体区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">		<!-- 注意：验证方式写在form中 -->
            <el-input v-model="addForm.username"></el-input> <!-- 数据绑定写在input中 -->
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
    </el-form>
    <!-- 对话框底部区域 -->
    <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
    </span>
</el-dialog>
```
​	**5.4** 添加数据绑定和校验规则：
```javascript
data() {
  //验证邮箱的规则
  var checkEmail = (rule, value, cb) => {
    const regEmail = /^\w+@\w+(\.\w+)+$/
    if (regEmail.test(value)) {
      return cb()
    }
    //返回一个错误提示
    cb(new Error('请输入合法的邮箱'))
  }

  return {
    //保存请求回来的用户列表数据
    userList: [],
    total: 0,
    //是否显示添加用户弹出窗
    addDialogVisible: false,
    // 添加用户的表单数据
    addForm: {
      username: '', password: '', email: '', mobile: ''
    },
    // 添加表单的验证规则对象
    addFormRules: {
      username: [ ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
      ],
      email: [// 自定义版本验证对象
          { validator:checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur'}
      ],
      mobile: [ ]
    }
  }
}
```
​	**5.5** 当关闭对话框时，重置添加用户弹窗表单
​			给el-dialog添加@close事件，在事件中添加重置表单的代码

```javascript
methods:{
  ....
  addDialogClosed(){
      //对话框关闭之后，通过引用重置表达
      this.$refs.addFormRef.resetFields();
  }
}
```
​	**5.6** 点击对话框中的确定按钮，**发送请求完成添加用户**的操作
​			首先给确定按钮添加点击事件，在点击事件中完成业务逻辑代码

```javascript
methods:{
  ....
  addUser(){
      //点击确定按钮，添加新用户
      //调用validate进行表单验证
      this.$refs.addFormRef.validate( async valid => {
          if(!valid) return this.$message.error("请填写完整用户信息");
          //发送请求完成添加用户的操作
          const {data:res} = await this.$http.post("users",this.addForm)
          //判断如果添加失败，就做提示
          if (res.meta.status !== 200)
              return this.$message.error('添加用户失败')
          //添加成功的提示
          this.$message.success("添加用户成功")
          //关闭对话框
          this.addDialogVisible = false
          //重新请求最新的数据
          this.getUserList()
      })
  }
}
```



**6. 实现修改用户**

---

​	**6.1** 为用户列表中的修改按钮绑定点击事件

​	**6.2** 在页面中添加修改用户对话框，并修改对话框的属性

​	**6.3** 根据id查询需要修改的用户数据

```javascript
//按钮的@click=展示编辑用户的对话框
async showEditDialog(id) {
    //使用接口，发送请求根据id获取用户信息
    const { data: res } = await this.$http.get('users/' + id)
    //判断如果添加失败，就做提示
    if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
    //将获取到的数据保存到数据editForm中
    this.editForm = res.data
    //显示弹出窗
    this.editDialogVisible = true
}
```

​	**6.4** 在弹出窗中添加修改用户信息的表单并做响应的数据绑定以及数据验证

```vue
 <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
    <!-- 对话框主体区域 -->
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
    </el-form>
</el-dialog>     
```

​	**6.5** 数据绑定和校验规则：

```javascript
//控制修改用户对话框的显示与否
editDialogVisible: false,
//修改用户的表单数据
editForm: {
    username: '',
    email: '',
    mobile: ''
},
//修改表单的验证规则对象
editFormRules: {
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
    ],
    mobile: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { validator: checkMobile,  message: '手机号码不正确，请重新输入', trigger: 'blur' }
    ]
}
```

​	**6.6** 监听对话框关闭事件，在对话框关闭之后，重置表单

```vue
<el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
```

```javascript
editDialogClosed(){
    //对话框关闭之后，重置表达
    this.$refs.editFormRef.resetFields()
}
```

​	**6.7** 在用户点击确定按钮的时候，验证数据成功之后发送请求完成修改

```javascript
editUser() {
    //用户点击修改表单中的确定按钮之后，验证表单数据
    this.$refs.editFormRef.validate(async valid => {
    if (!valid) return this.$message.error('请填写完整用户信息')
    //发送请求完成修改用户的操作
    const { data: res } = await this.$http.put(
        'users/' + this.editForm.id,
        this.editForm
    )
    //判断如果修改失败，就做提示
    if (res.meta.status !== 200) return this.$message.error('修改用户失败')
    //修改成功的提示
    this.$message.success('修改用户成功')
    //关闭对话框
    this.editDialogVisible = false
    //重新请求最新的数据
    this.getUserList()
    })
}
```



**7. 实现删除用户** ==MessageBox组件==

---

**7.1** 在点击删除按钮的时候，我们应该跳出提示信息框，让用户确认要进行删除操作。
	 如果想要使用确认取消提示框，我们需要先**将提示信息框挂载到`vue`**中。
**7.2** 导入`MessageBox`组件，并全局挂载 `Vue.prototype.$confirm = MessageBox.confirm`
**7.3** 给用户列表中的删除按钮添加事件，并在事件处理函数中弹出确定取消窗,最后再根据id发送删除用户的请求

```javascript
async removeUserById(id){
    //弹出确定取消框，是否删除用户
    const confirmResult = await this.$confirm('请问是否要永久删除该用户','删除提示',{
    confirmButtonText:'确认删除',
    cancelButtonText:'取消',
    type:'warning'
    }).catch(err=>err)
    //如果用户点击确认，则confirmResult 为'confirm'
    //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
    if(confirmResult != "confirm"){
        return this.$message.info("已经取消删除")
    }
    //发送请求根据id完成删除操作
    const {data:res} = await this.$http.delete('users/'+id)
    //判断如果删除失败，就做提示
    if (res.meta.status !== 200) return this.$message.error('删除用户失败')
    //修改成功的提示
    this.$message.success('删除用户成功')
    //重新请求最新的数据
    this.getUserList()
}
```

