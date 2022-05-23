import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Stock from '../views/Stock.vue'
import Politicas from '../views/Politicas.vue'
import Escaner from '../views/Escaner.vue'
import PoliticaArticulo from '../views/PoliticaArticulo.vue'
import Qr from '../views/Qr.vue'

Vue.use(VueRouter)

const routes = [
  
  {
    path: '/Login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if(sessionStorage.getItem('logged')){
        next('/')
      }
    
    }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      guest: true
    }
  },
  {
    path: '/Stock',
    name: 'Stock',
    component: Stock,
    meta: {
      guest: true
    }
  },
  {
    path: '/Politicas',
    name: 'Politicas',
    component: Politicas,
    meta: {
      guest: true
    }
  },
  {
    path: '/PoliticaArticulo',
    name: 'PoliticaArticulo',
    component : PoliticaArticulo,
    meta:{
      guest: true
    }
  },
  {
    path: '/Escaner',
    name: 'Escaner',
    component : Escaner,
    meta:{
      guest: true
    }
  },
  {
    path: '/Qr',
    name: 'Qr',
    component : Qr,
    meta:{
      guest: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {


  if(to.matched.some(record => record.meta.guest)) {

    if(sessionStorage.getItem('logged') == null ||
    sessionStorage.getItem('logged') == 'null' ||
    sessionStorage.getItem('logged') == undefined ||
    sessionStorage.getItem('logged') == 'undefined' ||
    sessionStorage.getItem('logged') == false ||
    sessionStorage.getItem('logged') == 'false'

    ){
      next({ name: 'Login'})
    }else{
      next()
    }
  }else {
    next()
  }

})

export default router
