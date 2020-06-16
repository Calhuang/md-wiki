import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/entry/:id',
    name: 'Entry',
    component: Home,
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Edit'),
  },
  {
    path: '/add',
    name: 'Add',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Edit'),
  },
  {
    path: '/search/:term',
    name: 'Search',
    component: () => import(/* webpackChunkName: "about" */ '@/views/SearchResults'),
  },
  {
    path: '/notfound',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "about" */ '@/views/NotFound'),
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router
