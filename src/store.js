import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('user'))
  },
  mutations: {
    setUser (state, obj) {
      state.user = obj
      localStorage.setItem('user', JSON.stringify(obj))
    }
  }
})
