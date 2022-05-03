<template>
     <v-container class="mt-5">
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            dark
            @click="clicStock"
        >Stock</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            class="mt-5"
            dark
        >Pedido</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            class="mt-5"
            dark
        >Despacho</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            class="mt-5"
            dark
        >Ingreso</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            class="mt-5"
            dark
        >Ventas</v-btn>
      </v-container>
</template>

<script>
export default {
    name:'Home',
    data(){
        return{

        }
    },
    methods:{
        clicStock(){
             this.$router.push({name: 'Stock'});
        }
    }
}
</script>

<style>

</style>