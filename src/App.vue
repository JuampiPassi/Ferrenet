<template>
  <v-app>
    <Login v-if="!check"></Login> 
    <Header v-if="check"></Header>
    <v-main v-if="check">
       <router-view v-slot="{ Component }">
         <transition name="route" mode="out-in">
           <component :is="Component"></component>
         </transition>
       </router-view>
    </v-main>
    <Footer v-if="check"></Footer>
  </v-app>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue'
import Login from './views/Login.vue'
export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Login
  },

  data(){
    return {

    }
  },
   computed: {
    check: function(){
      if (
        sessionStorage.getItem('logged') == 'false' ||
        sessionStorage.getItem('logged') == false ||
        sessionStorage.getItem('logged') == undefined ||
        sessionStorage.getItem('logged') == 'undefined' ||
        sessionStorage.getItem('logged') == null ||
        sessionStorage.getItem('logged') == 'null'
			) {
        return false;
      }else{
        return true;
      }
    }
  },
  
};
</script>
<style>
  /* Route transitions*/
  .route-enter-from{
    opacity: 0;
    transform: translateX(100px);
  }
  .route-enter-active{
    transform: all 0.3s ease-out;
  }
  .route-leave-to{
    opacity: 0;
    transform: translateX(-100px);
  }
  .route-leave-active{
    transform: all 0.3s ease-in;
  }
</style>
