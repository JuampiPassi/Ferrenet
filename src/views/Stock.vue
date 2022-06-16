<template>
     <v-container class="mt-5">
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            dark
            @click="clicPoliticas"
        >Política</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            class="mt-5"
            dark
        >Ajuste</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            class="mt-5"
            dark
            @click="clicUbicacion"
        >Ubicación</v-btn>
       
      </v-container>
</template>

<script>
export default {
    name:'Stock',
    data(){
        return{

        }
    },
    methods:{
        clicPoliticas(){
             this.$router.push({name: 'Politicas'});
        },
        clicUbicacion(){
            this.$router.push({name: 'Ubicacion'});   
        }

    },

}
</script>

<style>

</style>