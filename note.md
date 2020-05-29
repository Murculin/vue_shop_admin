# 电商后台管理系统

## git

git branch 查看当前分支

git checkout -b xxx  新建并切换至指定分支

git checkout xxx  切换至指定分支

git status 查看当前暂存区状态

git add . 添加到暂存区

git commit -m "xxx" 提交到本地仓库 并写入提交信息

git push 将本地的代码提交到线上仓库的对应分支

git push -u origin xxx 创建并提交代码到线上仓库的指定分支

若线上仓库有 readme 而本地没有就会报错

git pull --rebase origin master 将 master 分支的代码与本地合并

git merge xxx  将当前分支与xxx合并



## 登陆/退出功能

1. 需求：
   登陆页面输入用户名密码
   调用后台接口进行验证
   通过验证之后，根据后台的响应状态跳转到项目主页
2. 技术点
   http 本身无状态
   通过 cookie 在客户端记录状态
   通过 session 在服务端记录状态
   通过 token 方式维持状态
   有跨域问题时使用 token 维持登陆状态
   不存在可使用 cookie 和 session
3. token 原理
   登陆页面输入用户名密码进行登陆
   服务器验证通过后生成该用户的 token 并返回
   客户端存储 token 值
   后续请求都携带该 token 发送请求
   服务器验证 token 是否存在
   本项目中将 token 存储在 sessionStore 中



## ElementUi 配置

安装 @vue/cli-plugin-babel/preset

在根目录的babel.config.js中设置

```js

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```



## 表单

el-form el-form-item 在item中放每个表单项

### element 的表单验证

在 data 中设置规则 loginRules
el-form :rules="loginRules" 指定表单的适用的规则
el-form-item prop="username" 指定该表单项的规则

```js
    // trigger 触发验证的时机
	// message 验证失败的提示信息
	// validator 传入验证函数
	addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名应长度在 4 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '密码长度应在 6 到 12 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: cheackEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: cheackMobile, trigger: 'blur' }
        ]
      },
      // 验证函数
      // callback不传参为成功 传递new Error为错误提示
      const cheackEmail = (rule, value, callback) => {
          const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
          if (regEmail.test(value)) {
              return callback()
          }
          callback(new Error('请输入合法的邮箱'))
      }
```



### 提交预验证

el-form上的validate方法，返回true false

清空验证信息和表单信息

el-form上的resetFields方法

### 路由导航守卫

路由导航守卫控制访问权限
如果用户没有登陆，通过 url 直接访问特点页面。需要重新导航到登陆页面

```js
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转来
  // next 函数,表示放行 next('/login') 强制跳转
  if (to.path === '/login') {
    //若访问login页面则放行
    return next()
  }
  //从sessionStorage中读取token数据
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) {
    //若无token，直接跳转至login页面
    return next('/login')
  }
  // 有token则放行
  next()
})
```

### 退出功能

基于 token 的方式实现退出只需要销毁本地 token 即可，这样后续操作需要重新生成新 token 才能访问

```js
// 清空token
sessionStorage.clear()
// 跳转到登陆页
this.$router.push('/login')
```

## 主页

### axios 请求拦截

除了 login 外其他接口需要 Authorization 属性且值是 token 才能访问
通过 axios 请求拦截器添加 token，保证拥有获取数据的权限

```js
axios.interceptors.request.use(
  config => {
    //在发送请求之前做某事
    return config
  },
  function(error) {
    //请求错误时做些事
    return Promise.reject(error)
  }
)

// 需要删除拦截器
const myInterceptor = axios.interceptors.request.use(function() {
  /*...*/
})
axios.interceptors.request.eject(myInterceptor)

// 响应拦截器axios.interceptors.response同理
```



### 菜单

根据不同token获取不同的菜单

v-for做两层循环  分别遍历menulist 和 children

设置router模式  以index作为路径

## 用户管理页

### axios api

获取列表 axios.get('api/users')
  params 中 query 为搜索关键词 pagenum 为请求第几页 pagesize 为每页的数据量
根据id获取详细信息 axios.get('api/users/:id')
添加 axios.post('api/users/:id',{...})
编辑 axios.put('api/users/:id',{...})
删除 axios.delete('api/users/:id')
其他页面同理

### 翻页

el-pagination

@size-change    每页数据量改变

@current-change 翻页

### element 表格

el-table 的data属性上绑定数据

其中嵌套el-table-column表示列

用porp属性指定每一列的值

特殊列可以在插槽中用temple自动内容

可以通过 vue 的作用域插槽的方式获得子组件上的数据
在需要的 el-table-column 标签中插入 templete 语法

```js
<template v-slot:slotName="value"></template>
```

这样通过 value 就可以获取子组件(本例中为 el-table-column)上的数据

```js
<el-table-column label="状态">
  // 作用域插槽
  <template v-slot:default="scope">
    <el-switch
      v-model="scope.row.mg_state"
      active-color="#13ce66"
      @change="stateChange(scope.row)"
    >
    </el-switch>
  </template>
</el-table-column>
```

使用 scope.row 可以获取到本行的数据

el-tooltip 包裹的元素鼠标移上去显示提示信息

### 增删改功能
增改的弹窗页面  使用el-dialog 其中存放表单
删除的警告弹窗  使用el的confirm 返回promise对象 then为确定catch为取消
消息提示 使用el的message this.$message.error 为失败信息
.success 为成功信息

修改功能的整体流程

1. 通过作用域插槽的scope.row获取本行表格的id 将其作为参数传入click事件
2. data中创建addForm对象并与表单中的数据双向绑定
3. 点击按钮触发click事件,调用相应的api接口,更据id获取数据并将返回的数据存储在data中的addForm对象中,让dialog显示
4. 点击取消或x时调用 dialogClosed函数清空表单
5. 点击确定 经过预验证 调用相应的api
6. 消息提示 让dialog隐藏 重新加载用户列表 


### 搜索功能

将搜索框与 query 值双向绑定(v-model)
再调用 get 'api/users' 接口 将 query 传入 params 返回搜索结果

```html
// getUserList函数axios获取数据
// 在点击搜索和清空按钮时重新获取数据
<el-input
  v-model="queryInfo.query"
  placeholder="请输入内容"
  class="input-with-select"
  @clear="getUserList"
  clearable
>
  <el-button
    slot="append"
    icon="el-icon-search"
    @click="getUserList"
  ></el-button>
</el-input>
```
## 角色管理页
### 表格展开列、栅格

type="expand"

在slot中写templete

其中的内容使用了el的栅格布局

把父容器一行分为24格

通过 row 和 col 组件，并通过 col 组件的 `span` 属性 :span指定该列占有多少格

```html
<el-row>
  <el-col :span="5"></el-col>
  <el-col :span="19"></el-col>
</el-row>
```

是由el-tag 属性为closable

### 设置角色权限

el-tree组件  data指定需要渲染的数组 可以指定子节点的属性名

```js
defaultProps: {
    label: 'authName',
    children: 'children'
},
```

这样就会逐级遍历children属性的内容作为子节点

node-key 指定每一行的key值作为tree的标识

使用到el-tree的方法

getHalfCheckedKeys() 获得半选中的节点的keys 即子tree的一部分被选中

getCheckedKeys() 获取选中的keys

将两者组合传递给后台

### 递归获取三级权限

后端返回的数据中权限分为三级 以children的形式嵌套
在点击权限分配按钮时
需要将该数据的所有三级权限处理成数组 传入el-tree组件 的default-checked-keys 属性中,让他们被默认选中
使用递归的方法
```js
// 递归获取所有三级权限,保存到数组中
getDefKeys (node, arr) {
  // 没有children属性的为三级权限
  if (!node.children) {
    return arr.push(node.id)
  }
  node.children.forEach(item => {
    // 有children则非三级权限,继续调用函数本身
    this.getDefKeys(item, arr)
  })
},
```
## 商品管理页
### 树形表格
使用 vue-table-with-tree-grid 基于ivew的树形表格组件

传入数组数据：data，自动识别children属性

表格的每一列都是一个templete

给表格绑定columns数组

```js
        {
          label: '分类名称', // 列标题
          prop: 'cat_name' // 值
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template', // 是否以template方式传入
          template: 'isUseful' // 对应template插槽名
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
```



### 联级选择器选择父分类
在需要选择有父子关系的选项时使用 el-cascader v-model绑定一个数组
```js
          <el-cascader
            v-model="cascaderValue"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChage"
            :clearable="true"
          ></el-cascader>
```
创建新分类时需要提供父分类的id  若为0则时一级分类
级联选择器需要一个options 数组，控制选择器内容

一个props对象配置

```js
cascaderProps: {
    expandTrigger: 'hover', // 触发方式
    value: 'cat_id', // 值
    label: 'cat_name', // 标题
    children: 'children', // 子列表的属性名
    checkStrictly: true
}
```
点击选择时触发@change
以数组的形式返回所选的value
若为空

## 添加商品页面

### 顶部进度条

el-step控制顶部进度条

数值与el-tab的activeName一致（activeName默认string类型，需要转化)

### 不选择分类禁止翻页

给el-tabs 传递beforeTabLeave

### 整体逻辑流程

1. 与编辑商品共用一个页面route'/goods/add'   头如果add/id判断
   使用tabs标签分页,把5个页面的信息当做一个表单
   使用el-form标签包裹所有tab
2. goods_cat 用级联选择器选取
   动态参数用 el-select勾选
   图片上传使用el-upload
   富文本编辑器vue-quill-editor
3. 最后提交时整体预验证和预处理
   上传数据的接口要求goods_cat attrs为字符串格式
   此时,级联选择器与goods_cat双向绑定 要求绑定对象是数组 否则会报错
   解决:
   对addForm中的数据操作时先深拷贝出一个新对象
   addForm负责渲染视图 新对象负责上传数据
4. 1) 将goods_cat转化为以,分割的字符串
   2) 将attrs转化为以‘空格’分割的字符串



### 图片上传及预览

上传 el-upload

```js
            <el-upload class="upload"
              :action="uploadUrl"
              :headers="ajaxHeader"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handelSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
```

使用dialog 预览

### 富文本编辑器

使用quill-editor 做双向数据绑定

## 参数设置页面

为分类添加动态参数和静态属性

使用级联选择器选择要配置的分类

### 切换显示内容

使用 el-tabs  el-tab-pane控制切换显示内容 

```js
<el-tabs v-model="activeName" @tab-click="handleClickTab">
   <el-tab-pane label="动态参数" name="many"></el-tab-pane>
	<el-tab-pane label="静态属性" name="only"></el-tab-pane>
</el-tabs>
```

@tab-click 触发时发送相应的网络请求获取数据

通过v-model绑定的activeName控制在哪一页

### newTag

el-button 和 el-input  通过v-if控制

回车和blur时触发add事件

## 订单页面

location使用el-timeline

```js
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in locationList"
          :key="index"
          type="primary"
          :timestamp="item.time">
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
```



## echarts

1. npm i echarts --save
2. 在需要使用echarts的页面import 
```js
import echarts from 'echarts'
```
3. 在mouted生命周期中初始化echarts 指定宽高和挂载的dom节点
```js
var myChart = echarts.init(document.getElementById('main'))
```
4. 写配置对象option
```js
var option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }
```
5. 使用配置对象 myChart.setOption(option)

## 知识点补盲

1. 关于 cookie session token维持登陆状态

   关于 async await Promise

2. 关于vue-router路由守卫

3. axios 请求拦截器

4. element 栅格

5. vue 作用域插槽

6. 深拷贝 原生/lodash

7. vue的$nexttrick

8. axios params

9. hash history

## hash history
### 解决的问题
url改变 浏览器会向对应的地址请求数据 并刷新
在采用前端路由方案时，路由映射由前端管理，我们需要阻止这种请求

可以采取hash和history两种方案

### hash
通过location.hash改变url 网页不会自动刷新
### history
h5的新特性
```js
// pushState会把数据压入history栈中 url为栈顶的那个l
history.pushState({}, '', 'url')
// 替换栈顶的url
history.replayState({}, '', 'url')
// 弹出栈顶的一个url 实现返回上n个页面 正数前进 负数后退
history.go(n)
history.back() // history.go(-1) 返回上一页
history.forward() // history.go(1) 前进到下一页
```