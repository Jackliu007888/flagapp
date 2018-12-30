import router from './router'
import fontSizeMixin from '@/common/js/font-size-mixin'
// import store from '@/store'

export default {
  // store,
  router,
  mixins: [fontSizeMixin],
  render(h) {
    return <router-view id="app" />
  }
}