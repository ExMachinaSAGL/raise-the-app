// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import RaiseTheApp from './components/RaiseTheApp'
import store from './store/store'
import 'babel-polyfill'
import './theme/fa-path.scss'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#notifications-popup',
  store,
  template: '<RaiseTheApp/>',
  components: { RaiseTheApp }
})
