import VueRouter from 'vue-router'

const router = new VueRouter({
  mode: 'history',
  base: '/flagApp/',
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import ('@/pages/main')
    },
  ]
})

export default router