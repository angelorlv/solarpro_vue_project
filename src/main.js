import Vue from 'vue'
import App from './App.vue'

import jquery from 'jquery'

window.$ = jquery

//CSS
import "./assets/main.css"

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
