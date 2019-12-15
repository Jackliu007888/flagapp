import router from './router'
import fontSizeMixin from '@/common/js/font-size-mixin'
// import store from '@/store'

export default {
  // store,
  router,
  mixins: [fontSizeMixin],
  mounted() {
    
    this.injectEruda()
  },
  methods: {
    injectEruda() {
      const src = 'https://cdn.bootcss.com/eruda/1.5.2/eruda.min.js'
      if (!/djhs=true/.test(window.location) && localStorage.getItem('active-eruda') !== 'true') return
      window.document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>')
      window.document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>')
    }
  },
  render(h) {
    return <router-view id="app" />
  }
}