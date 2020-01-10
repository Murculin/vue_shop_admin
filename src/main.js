import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/styles/reset.css'
import './assets/styles/global.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
Vue.component('tree-table', ZkTable)
Vue.config.productionTip = false
// axios请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.prototype.axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
