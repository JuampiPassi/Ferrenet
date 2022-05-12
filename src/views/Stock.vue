<template>
     <v-container class="mt-5">
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            dark
            @click="clicPoliticas"
        >Politica</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            class="mt-5"
            dark
        >Ajuste</v-btn>
       
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
    },

}
</script>

<style>

</style>