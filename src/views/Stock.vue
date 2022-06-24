<template>
     <v-container class="mt-5">
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            style="color:white"
            v-if="verPoliticas"
            @click="clicPoliticas"
        >Política</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            class="mt-5"
            style="color:white"
            v-if="verAjuste"
            @click="clicAjuste"
        >Ajuste</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            class="mt-5"
            style="color:white"
            v-if="verUbicacion"
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
        },
        clicAjuste(){
            this.$router.push({name: 'Ajuste'});
        }

    },
    computed:{
        verPoliticas(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 1.1))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
         verAjuste(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 1.2))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
         verUbicacion(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 1.3))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
    }

}
</script>

<style>

</style>