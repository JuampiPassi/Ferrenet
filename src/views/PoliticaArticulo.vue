<template>
    <v-container>
        <v-card elevation="0" v-if="this.articulos.length>0">
           <!-- <v-card-title>{{id}}</v-card-title>-->
           <!-- <v-card-subtitle>Articulos Restantes: {{this.articulos.length}}</v-card-subtitle>-->
            <v-card-text>
                <template v-if="this.articulos.length>0">
                    <Articulo2 :cod="this.codigo" :key="componentKey" @validado="bloqueado=false"></Articulo2>
                </template>
            </v-card-text>
            <v-alert class=""  :type="tipoMsjeAjuste"  v-model="alertAjuste" dense dismissible transition="scale-transition">
                    {{mensajeAjuste}}
                </v-alert>
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
                    <v-card-title>Motivos</v-card-title>
                </v-toolbar>
                <v-list>
                    <v-list-item-group v-model="motivoselected" active-class="orange--text">
                        <template v-for="(item, index) in motivos" >
                            <v-list-item :key="item.MOTIVO_ID" :value="item.MOTIVO_ID">
                                <template v-slot:default="{active}">
                                    <v-list-item-content>
                                        <v-list-item-title v-text="item.MOTIVO">

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
                    <v-btn text @click="aceptarMotivo" color="orange" :disabled="disabledAceptarMotivo">Aceptar</v-btn>
                    <v-btn text @click="dialogMotivos=false">Cancelar</v-btn>
                </v-card-actions>
            </v-card>   
        </v-dialog>
    </v-container>
</template>

<script>
import ApiServer from './../api';
import Articulo2 from '../components/Articulo2.vue'
export default {
    name:'PoliticaArticulo',
    components:{Articulo2},
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
            motivos:[],
            motivoselected: '',
            bloqueado:true,
            mensajeAjuste:'Artículo ajustado con exito',
            alertAjuste:false,
            tipoMsjeAjuste:'success'
        }
    },
    methods:{
       async siguiente(){
            if(this.articulos.length>0){
                try {
                   let result = await ApiServer.eliminarArticulo(this.codigo)
                   console.log(result) 
                    this.alertAjuste=true
                    setTimeout(()=>{
                        this.alertAjuste=false
                    },3000)
                    this.articulos.shift();
                    this.codigo = this.articulos[0].COD_ART
                    this.componentKey +=1;
                    this.bloqueado=true
                } catch (error) {
                    console.log(error)
                    this.mensajeAjuste="Error al ajustar artículo"
                    this.tipoMsjeAjuste="error"
                    this.alertAjuste=true
                    setTimeout(()=>{
                        this.alertAjuste=false
                    },5000)
                }
            }
        },
        pasar(){
            this.dialogMotivos=true;
        },
        async aceptarMotivo(){
            this.dialogMotivos=false
            let info={
                art_id:1,
                cod_art:this.articulos[0].COD_ART,
                usuario:'prueba',
                motivo_id:this.motivoselected
            }
            try {
                let resp = await ApiServer.artnoajustado(info)
                console.log(resp)
            } catch (error) {
                console.log(error)
            }
        }
    },
    async mounted(){
        try {
            let resp = await ApiServer.verArticulos(this.id);
            this.motivos = await ApiServer.verMotivos();
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
    computed: {
        disabledAceptarMotivo(){
            if(this.motivoselected=='' || this.motivoselected==undefined) {
                return true
            }else{
                return false
            }
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