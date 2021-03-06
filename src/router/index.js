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
import Pedidos from '../views/pedidos/Pedidos.vue'
import Consolidados from '../views/pedidos/Consolidados.vue'
import ConsolidadosArticulo from '../views/pedidos/ConsolidadosArticulo.vue'
import Ordylimp from '../views/Ordylimp.vue'
import Armonia from '../views/Armonia.vue'
import Tareas from '../views/tareas/Tareas.vue'
import Capacitaciones from '../views/capacitaciones/Capacitaciones.vue'
import AsignarBox from '../views/pedidos/AsignarBox.vue'

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
    path: '/ConsolidadosArticulo',
    name: 'ConsolidadosArticulo',
    component : ConsolidadosArticulo,
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
    path: '/Tareas',
    name: 'Tareas',
    component : Tareas,
    meta:{
      guest: true
    },
    beforeEnter: (to, from,next) => {
      if(sessionStorage.getItem('rol')==1){
        next();
      }else if(sessionStorage.getItem('modulos')!=null){
        let modulos =JSON.parse(sessionStorage.getItem('modulos'));
        modulos.forEach(element => {
            if(element.id_modulo==7)
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
  {
    path: '/Ordylimp',
    name: 'Ordylimp',
    component : Ordylimp,
    meta:{
      guest: true
    },
    beforeEnter: (to, from,next) => {
      if(sessionStorage.getItem('rol')==1){
        next();
      }else if(sessionStorage.getItem('modulos')!=null){
        let modulos =JSON.parse(sessionStorage.getItem('modulos'));
        modulos.forEach(element => {
            if(element.id_modulo==8.1)
              next()
        });
      }
      next(false)
    },
  },
  {
    path: '/Armonia',
    name: 'Armonia',
    component : Armonia,
    meta:{
      guest: true
    },
    beforeEnter: (to, from,next) => {
      if(sessionStorage.getItem('rol')==1){
        next();
      }else if(sessionStorage.getItem('modulos')!=null){
        let modulos =JSON.parse(sessionStorage.getItem('modulos'));
        modulos.forEach(element => {
            if(element.id_modulo==8.2)
              next()
        });
      }
      next(false)
    },
  },
  {
    path: '/Pedidos',
    name: 'Pedidos',
    component: Pedidos,
    meta: {
      guest: true
    },
    beforeEnter: (to, from,next) => {
      if(sessionStorage.getItem('rol')==1){
        next();
      }else if(sessionStorage.getItem('modulos')!=null){
        let modulos =JSON.parse(sessionStorage.getItem('modulos'));
        modulos.forEach(element => {
            if(element.id_modulo==2)
              next()
        });
      }
      next(false)
    },
  },
  {
    path: '/Consolidados',
    name: 'Consolidados',
    component: Consolidados,
    meta: {
      guest: true
    },
    beforeEnter: (to, from,next) => {
      if(sessionStorage.getItem('rol')==1){
        next();
      }else if(sessionStorage.getItem('modulos')!=null){
        let modulos =JSON.parse(sessionStorage.getItem('modulos'));
        modulos.forEach(element => {
            if(element.id_modulo==2.1)
              next()
        });
      }
      next(false)
    },
  },
  {
    path: '/AsignarBox',
    name: 'AsignarBox',
    component: AsignarBox,
    meta: {
      guest: true
    },
    beforeEnter: (to, from,next) => {
      if(sessionStorage.getItem('rol')==1){
        next();
      }else if(sessionStorage.getItem('modulos')!=null){
        let modulos =JSON.parse(sessionStorage.getItem('modulos'));
        modulos.forEach(element => {
            if(element.id_modulo==2.3)
              next()
        });
      }
      next(false)
    },
  },
  {
    path: '/Capacitaciones',
    name: 'Capacitaciones',
    component: Capacitaciones,
    meta: {
      guest: true
    },
    beforeEnter: (to, from,next) => {
      if(sessionStorage.getItem('rol')==1){
        next();
      }else if(sessionStorage.getItem('modulos')!=null){
        let modulos =JSON.parse(sessionStorage.getItem('modulos'));
        modulos.forEach(element => {
            if(element.id_modulo==9)
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
