<template>
     <v-container>
        <template v-if="this.politicas.length>0">
             <template v-for="(item, index) in this.politicas">
                <v-btn :key=index
                    block
                    color="#ef6b01"
                    elevation="2"
                    x-large
                    dark
                    class="mt-5"
                    @click="verArticulos(item.POLITICA)"
                >{{item.POLITICA}}</v-btn>
             </template>
        </template>
         
        <v-alert  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
         
       
      </v-container>
</template>

<script>
import ApiServer from './../api';
export default {
    name:'Politicas',
    data(){
        return{
            politicas: [],
            mensaje:"No se encontraron politicas",
            tipo: 'error',
            alert: false,
        }
    },
    methods:{
        verArticulos(politica){
            this.$router.push({name: 'PoliticaArticulo', params:{ id: politica}}); 
        }
    },
     async mounted(){
         
        try {
            let resp = await ApiServer.verPoliticas();
            this.politicas= resp;
            if(this.politicas.length==0){
                this.alert=true
            }
        } catch (error) {
            this.mensaje="Error al consultar politicas";
            this.alert=true;
            console.log(error)
        }
        
    },
    watch:{
        
    }

}
</script>

<style>

</style>