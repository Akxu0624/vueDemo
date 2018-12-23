import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Index from '@/views/Index'
import ServerMgmt from '@/views/serverMgmt/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/serverMgmt',
      name: 'serverMgmt',
      component: ServerMgmt
    }
  ]
})
