
import App from './App.vue'
import jquery from 'jquery'
import VueRouter from 'vue-router'

let Vue = require('vue').default
let VueResource = require('vue-resource').default
let Vuex = require('vuex').default
let router = require('./routes/index.js').default
//-------
Vue.use(VueResource)
Vue.use(Vuex)
Vue.use(VueRouter)

window.$ = jquery

//CSS
import "./assets/main.css"


//-Config
Vue.config.productionTip = false
Vue.http.options.root = '/api';
Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';

let store = require('./store/index').default

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
