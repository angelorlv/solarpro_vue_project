
import App from './App.vue'
import jquery from 'jquery'

let Vue = require('vue').default
let VueResource = require('vue-resource').default

//-------
Vue.use(VueResource)

window.$ = jquery

//CSS
import "./assets/main.css"


//-Config
Vue.config.productionTip = false
Vue.http.options.root = '/api';
Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';

new Vue({
  render: h => h(App),
}).$mount('#app')
