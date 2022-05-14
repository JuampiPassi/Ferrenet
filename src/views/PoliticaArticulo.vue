<template>
    <v-container>
        <v-card elevation="0" v-if="this.articulos.length>0">
            <v-card-title>{{id}}</v-card-title>
            <v-card-text>
                <template v-if="this.articulos.length>0">
                    <Articulo :cod="this.codigo" :key="componentKey"></Articulo>
                </template>
            </v-card-text>
            <v-card-actions>
                <v-btn outlined text color="#ef6b01" @click="siguiente()">
                    Siguiente
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
    </v-container>
</template>

<script>
import ApiServer from './../api';
import Articulo from '../components/Articulo.vue'
export default {
    name:'PoliticaArticulo',
    components:{Articulo},
    data(){
        return{
            id: this.$route.params.id,
            articulos:[],
            tipo:'error',
            mensaje:'No se encontraron articulos',
            alert:false,
            codigo: '',
            componentKey: 0
        }
    },
    methods:{
        siguiente(){
            if(this.articulos.length>0){
                this.codigo = this.articulos[0].COD_ART
                this.articulos.shift();
                this.componentKey +=1;
            }
        }
    },
    async mounted(){
        try {
            let resp = await ApiServer.verArticulos(this.id);
            this.articulos = resp;
            this.codigo = this.articulos[0].COD_ART;
            if(this.articulos.length==0){
                this.alert=true;
            }
            console.log('articulos: ',resp)
        } catch (error) {
            console.log(error)
        }
    },
    watch:{
        articulos(){
            console.log(this.articulos.length)
            if(this.articulos.length==0){
                this.alert=true
            }
        }
    }
   

}
</script>

<style>

</style>