import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Stock from '../views/Stock.vue'
import Politicas from '../views/Politicas.vue'
import Escaner from '../views/Escaner.vue'
import PoliticaArticulo from '../views/PoliticaArticulo.vue'
import Ubicacion from '../views/Ubicacion.vue'
import Ajuste from '../views/Ajuste.vue'
import Auditoria from '../views/Auditoria.vue'

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
    },
    beforeEnter: (to, from,next) => {
      if(sessionStorage.getItem('rol')==1){
        next();
      }else if(sessionStorage.getItem('modulos')!=null){
        let modulos =JSON.parse(sessionStorage.getItem('modulos'));
        modulos.forEach(element => {
            if(element.id_modulo==1)
              next()
        });
      }
      next(false)
    },
  },
  {
    path: '/Politicas',
    name: 'Politicas',
    component: Politicas,
    meta: {
      guest: true
    },
    beforeEnter: (to, from,next) => {
      if(sessionStorage.getItem('rol')==1){
        next();
      }else if(sessionStorage.getItem('modulos')!=null){
        let modulos =JSON.parse(sessionStorage.getItem('modulos'));
        modulos.forEach(element => {
            if(element.id_modulo==1.1)
              next()
        });
      }
      next(false)
    },
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
    path: '/Ubicacion',
    name: 'Ubicacion',
    component : Ubicacion,
    meta:{
      guest: true
    },
    beforeEnter: (to, from,next) => {
      if(sessionStorage.getItem('rol')==1){
        next();
      }else if(sessionStorage.getItem('modulos')!=null){
        let modulos =JSON.parse(sessionStorage.getItem('modulos'));
        modulos.forEach(element => {
            if(element.id_modulo==1.3)
              next()
        });
      }
      next(false)
    },
  },
  {
    path: '/Ajuste',
    name: 'Ajuste',
    component : Ajuste,
    meta:{
      guest: true
    },
    beforeEnter: (to, from,next) => {
      if(sessionStorage.getItem('rol')==1){
        next();
      }else if(sessionStorage.getItem('modulos')!=null){
        let modulos =JSON.parse(sessionStorage.getItem('modulos'));
        modulos.forEach(element => {
            if(element.id_modulo==1.2)
              next()
        });
      }
      next(false)
    },
  },
  {
    path: '/Auditoria',
    name: 'Auditoria',
    component : Auditoria,
    meta:{
      guest: true
    },
    beforeEnter: (to, from,next) => {
      if(sessionStorage.getItem('rol')==1){
        next();
      }else if(sessionStorage.getItem('modulos')!=null){
        let modulos =JSON.parse(sessionStorage.getItem('modulos'));
        modulos.forEach(element => {
            if(element.id_modulo==8)
              next()
        });
      }
      next(false)
    },
  },
]

const router = new VueRouter({
  //mode: 'history',
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
