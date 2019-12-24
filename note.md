# 电商后台管理
## git
git checkout -b xxx 新建并切换至指定分支
git add . 添加到暂存区
git commit -m "xxx" 提交到本地仓库
git push -u origin xxx 提交代码到线上仓库的指定分支
若线上仓库有readme而本地没有就会报错
git pull --rebase origin master 将master分支的代码与本地合并

## 登陆/退出功能
  1. 需求：
    登陆页面输入用户名密码
    调用后台接口进行验证
    通过验证之后，根据后台的响应状态跳转到项目主页
  2. 技术点
    http本身无状态
    通过cookie 在客户端记录状态
    通过session 在服务端记录状态
    通过token 方式维持状态
    有跨域问题时使用token维持登陆状态
    不存在可使用cookie和session
  3. token原理
    登陆页面输入用户名密码进行登陆
    服务器验证通过后生成该用户的token并返回
    客户端存储token值
    后续请求都携带该token发送请求
    服务器验证token是否存在
  本项目中将token存储在sessionStore中

### element的表单验证
  在data中设置规则loginRules
  el-form :rules="loginRules" 指定表单的适用的规则
  el-form-item prop="username" 指定该表单项的规则
### 路由导航守卫
  路由导航守卫控制访问权限
  如果用户没有登陆，通过url直接访问特点页面。需要重新导航到登陆页面
```js
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转来
  // next 函数,表示放行 next('/login') 强制跳转
  if (to.path === '/login') { //若访问login页面则放行
    return next()
  }
  //从sessionStorage中读取token数据
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) { //若无token，直接跳转至login页面
    return next('/login')
  }
  // 有token则放行
  next()
})
```
### 退出功能
  基于token的方式实现退出只需要销毁本地token即可，这样后续操作需要重新生成新token才能访问

```js
// 清空token
sessionStorage.clear()
// 跳转到登陆页
this.$router.push('/login')
```
## 主页
### axios请求拦截
  除了login外其他接口需要Authorization属性且值是token才能访问
  通过axios请求拦截器添加token，保证拥有获取数据的权限
```js
axios.interceptors.request.use(config => {
    //在发送请求之前做某事
    return config
}, function(error){
    //请求错误时做些事
    return Promise.reject(error)
})

// 需要删除拦截器
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor)

// 响应拦截器axios.interceptors.response同理
```
## 知识点补盲
  1. 关于cookie session token
  2. 关于async await Promise
  3. 关于路由守卫
  4. axios请求拦截器
  5. element栅格
  6. vue作用域插槽