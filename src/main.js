import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/styles/reset.css'
// import axios from 'axios'

Vue.config.productionTip = false
// 请求的根路径
// axios.defaults.baseUrl = 'https://www.liulongbin.top:8888/api/private/v1/'
// Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
