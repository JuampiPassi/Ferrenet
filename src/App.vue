<template>
  <v-app>
    <Header></Header>
    <Footer></Footer>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Header from './components/Header';
import Footer from './components/Footer.vue'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },

  data(){
    return {

    }
  },
};
</script>
