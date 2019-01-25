import Vue from 'vue'
import App from './app.js'
import VueRouter from 'vue-router'
import FastClick from 'fastclick'
import httpPlugin from './plugins/request/index'
import VueKonva from 'vue-konva'

Vue.use(VueKonva)

import 'normalize.css'
import '@/common/style/index.styl'
import '@/common/style/animate.styl'


const httpPluginConfig = {
  /* eslint-disable-next-line */
  errorHandler(errorType, err) {
    if (errorType === 'normalError') {
      // do nothing
      return false
    }
  }
}

Vue.use(httpPlugin, httpPluginConfig)

FastClick.attach(document.body)

Vue.use(VueRouter)
Vue.config.productionTip = false

new Vue(App).$mount('#app')