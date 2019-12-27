# 电商后台管理系统

## git

git checkout -b xxx 新建并切换至指定分支
git add . 添加到暂存区
git commit -m "xxx" 提交到本地仓库
git push -u origin xxx 提交代码到线上仓库的指定分支
若线上仓库有 readme 而本地没有就会报错
git pull --rebase origin master 将 master 分支的代码与本地合并
git merge master 将当前分支合并到master下

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

### element 的表单验证

在 data 中设置规则 loginRules
el-form :rules="loginRules" 指定表单的适用的规则
el-form-item prop="username" 指定该表单项的规则

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

## 用户管理页

### axios api

获取列表 axios.get('api/users')
  params 中 query 为搜索关键词 pagenum 为请求第几页 pagesize 为每页的数据量
根据id获取详细信息 axios.get('api/users/:id')
添加 axios.post('api/users/:id',{...})
编辑 axios.put('api/users/:id',{...})
删除 axios.delete('api/users/:id')
其他页面同理

### element 表格

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
### 递归获取三级权限
后端返回的数据中权限分为三级 以children的形式嵌套
在点击权限分配按钮时
需要将该数据的所有三级权限处理成数组 传入el-tree组件 的default-checked-keys 属性中,让他们被默认选中
使用递归的方法
```js
// 递归获取所有三级权限,保存到数组中
getDefKeys (node, arr) {
  // 没有children属性的为三级权限
  console.log(node)
  if (!node.children) {
    return arr.push(node.id)
  }
  node.children.forEach(item => {
    this.getDefKeys(item, arr)
  })
},
```
## 商品管理页
### 树形表格
使用 vue-table-with-tree-grid 基于ivew的树形表格组件
### 联级选择器
在需要选择有父子关系的选项时使用 el-cascader

## 知识点补盲

1. 关于 cookie session token
2. 关于 async await Promise
3. 关于路由守卫
4. axios 请求拦截器
5. element 栅格
6. vue 作用域插槽
