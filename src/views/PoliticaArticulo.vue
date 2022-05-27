<template>
    <v-container>
        <v-card elevation="0" v-if="this.articulos.length>0">
            <v-card-title>{{id}}</v-card-title>
            <v-card-subtitle>Articulos Restantes: {{this.articulos.length}}</v-card-subtitle>
            <v-card-text>
                <template v-if="this.articulos.length>0">
                    <Articulo :cod="this.codigo" :key="componentKey" @validado="bloqueado=false"></Articulo>
                </template>
            </v-card-text>
            <v-card-actions>
                <v-btn outlined text color="#ef6b01" @click="siguiente()" :disabled="bloqueado">
                    Aceptar
                </v-btn>
                <v-btn outlined text color="secondary" @click="pasar()">
                    Pasar
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
        <v-dialog  v-model="dialogMotivos" persistent :overlay="false" max-width="500px" scrollable
            transition="dialog-bottom-transition"
        >
            <v-card>
                <v-toolbar color="#ef6b01">
                    <v-card-title primary-title>
                        Causas
                    </v-card-title>
                </v-toolbar>
                
                <v-list>
                    <v-list-item-group v-model="motivoselected" active-class="orange--text">
                        <template v-for="(item, index) in motivos" >
                            <v-list-item :key="item.id" :value="item.id">
                                <template v-slot:default="{active}">
                                    <v-list-item-content>
                                        <v-list-item-title v-text="item.motivo">

                                        </v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        <v-icon v-if="active">mdi-check</v-icon>
                                    </v-list-item-action>
                                </template>
                            </v-list-item>
                            <v-divider :key="index+'a'"></v-divider>
                        </template>
                    </v-list-item-group>
                </v-list>


                <v-card-actions>
                    <v-btn text @click="aceptarMotivo" >Aceptar</v-btn>
                    <v-btn text @click="dialogMotivos=false">Cancelar</v-btn>
                </v-card-actions>
            </v-card>   
        </v-dialog>
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
            componentKey: 0,
            dialogMotivos: false,
            motivos:[
                {id:1,motivo: "Motivo 1"},
                {id:2,motivo: "Motivo 2"},
                {id:3,motivo: "Motivo 3"},
                {id:4,motivo: "Motivo 4"},
                ],
            motivoselected: '',
            bloqueado:true,
        }
    },
    methods:{
        siguiente(){
            if(this.articulos.length>0){
                this.codigo = this.articulos[0].COD_ART
                this.articulos.shift();
                this.componentKey +=1;
            }
        },
        pasar(){
            this.dialogMotivos=true;
        },
        aceptarMotivo(){
            console.log(this.motivoselected)
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
            if(this.articulos.length==0){
                this.alert=true
            }
        }
    }
   

}
</script>

<style>

</style>