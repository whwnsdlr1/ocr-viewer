import Vue from 'vue'
import App from './App.vue'

import Vuex from 'vuex'
import store from '@/store/index'
Vue.use(Vuex)

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
Vue.use(VueMaterial)

import cornerstonePlugin from '@/plugins/cornerstonePlugin'
Vue.use(cornerstonePlugin)

import cornerstoneToolsPlugin from '@/plugins/cornerstoneToolsPlugin'
Vue.use(cornerstoneToolsPlugin)

Vue.config.productionTip = false

new Vue({
  store: store.store,
  render: h => h(App),
}).$mount('#app')
