<template>
    <v-container class="mt-5">
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            style="color:white"
            v-if="verOrd"
        >Orden y limpieza</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            class="mt-5"
            x-large
            style="color:white"
            v-if="verArmonia"
        >Armonía</v-btn>
    </v-container>
</template>

<script>
export default {
    name: 'Auditoria',
    data(){
        return{

        }
    },
    methods:{

    },
    computed:{
        verOrd(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 8.1))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
         verArmonia(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 8.2))!=undefined){
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