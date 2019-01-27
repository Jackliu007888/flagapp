import VueRouter from 'vue-router'

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import ('@/pages/main')
    },
    {
      path: '/demo-01',
      name: 'demo-01',
      component: () => import ('@/pages/demo-01')
    }, {
      path: '/make-flag',
      name: 'make-flag',
      component: () => import ('@/pages/make-flag')
    }
  ]
})

export default router