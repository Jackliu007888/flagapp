import VueRouter from 'vue-router'

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import ('@/pages/home')
    },
    {
      path: '/loading',
      name: 'loading',
      component: () => import ('@/pages/loading')
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