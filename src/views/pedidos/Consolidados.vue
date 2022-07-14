<template>
    <v-container>
         <template v-if="this.consolidados.length>0">
             <template v-for="(item, index) in this.consolidados">
                <v-btn :key=index
                    block
                    color="#ef6b01"
                    elevation="2"
                    x-large
                    dark
                    class="mt-5"
                    @click="verConsolidado(item.id)"
                >{{item.id}}-{{item.usuario}}-{{item.fecha}}</v-btn>
             </template>
        </template>

        <template v-if="loading">
            <v-row  class="fill-height" align-content="center" justify="center">
                <v-col
                class="text-subtitle-1 text-center"
                cols="12"
                >
                Cargando datos..
                </v-col>
                <v-col cols="6">
                <v-progress-linear
                    color="deep-orange accent-4"
                    indeterminate
                    rounded
                    height="6"
                ></v-progress-linear>
                </v-col>
            </v-row>
        </template>
        <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
    </v-container>
</template>

<script>
import ApiServer from '../../api';
import moment from 'moment';
export default {
    name: 'Consolidados',
     data(){
        return{
            loading:false,
            alert:false,
            mensaje:'',
            tipo:'error',
            consolidados:[]
        }
    },
    methods:{
        verConsolidado(id){
            this.$router.push({name: 'ConsolidadosArticulo', params:{ id: id}}); 
        }
    },
    async mounted(){
        try {
            this.loading=true
            let emp = await ApiServer.getEmpleadosLegajos();
            let logistica = await ApiServer.getLogisticaCons();
            if(logistica.length>0){
                logistica.forEach(log => {
                    let datos={
                        id:log.cons_id,
                        usuario:(emp.find(x => x.LEGAJO == log.usuario)).RZ,
                        fecha:(moment(log.fecha).format('DD-MM-YYYY'))
                    }
                    this.consolidados.push(datos)
                });
            }else{
                this.alert=true,
                this.mensaje="No se encontraron resultados"
                this.tipo="warning"        
                setTimeout(()=>{
                        this.$router.push({name: 'Pedidos'});
                    },2000)
            }
            this.loading=false
        } catch (error) {
           console.log(error) 
           this.alert=true,
           this.mensaje="Se ha producido un error"
           this.tipo="error"
           this.loading=false
        }
    }
}
</script>

<style>

</style>