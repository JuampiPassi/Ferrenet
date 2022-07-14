<template>
    <v-container class="mt-5">
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            style="color:white"
            v-if="verConsolidados"
            @click="clicConsolidados"
        >Consolidados</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            class="mt-5"
            x-large
            style="color:white"
            v-if="verIndividuales"
        >Individuales</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            class="mt-5"
            x-large
            style="color:white"
            v-if="verAsignarBox"
        >Asignar Box</v-btn>
    </v-container>
</template>

<script>
export default {
    name: 'Pedidos',
      data(){
        return{

        }
    },
    methods:{
        clicConsolidados(){
            this.$router.push({name: 'Consolidados'});
        },
    },
    computed:{
        verConsolidados(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 2.1))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verIndividuales(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 2.2))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verAsignarBox(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 2.3))!=undefined){
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