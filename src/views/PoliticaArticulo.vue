<template>
    <v-container>
        <v-card elevation="0" v-if="this.articulos.length>0">
           <!-- <v-card-title>{{id}}</v-card-title>-->
           <!-- <v-card-subtitle>Articulos Restantes: {{this.articulos.length}}</v-card-subtitle>-->
            <v-card-text>
                <template v-if="this.articulos.length>0">
                    <Articulo2 :cod="this.codigo" :key="componentKey" @validado="bloqueado=false" @info="pasarInfo($event)" @ajuste="agregarAjuste($event)"></Articulo2>
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
        <v-alert class=""  :type="tipoMsjeAjuste"  v-model="alertAjuste" dense dismissible transition="scale-transition">
            {{mensajeAjuste}}
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
        <v-overlay :value="cargando">
            <v-progress-circular
                indeterminate
                size="70"
                width="7"
            ></v-progress-circular>
        </v-overlay>
    </v-container>
</template>

<script>
import ApiServer from './../api';
import Articulo2 from '../components/Articulo2.vue'
import moment from 'moment';
export default {
    name:'PoliticaArticulo',
    components:{Articulo2},
    data(){
        return{
            id: this.$route.params.id,
            artid:'',
            escalaid:'',
            stkid:'',
            articulos:[],
            tipo:'error',
            mensaje:'No se encontraron articulos',
            alert:false,
            codigo: '',
            dep_id:'',
            ajuste:'',
            componentKey: 0,
            dialogMotivos: false,
            motivos:[],
            motivoselected: '',
            bloqueado:true,
            mensajeAjuste:'Artículo ajustado con exito',
            alertAjuste:false,
            tipoMsjeAjuste:'success',
            cargando:false
        }
    },
    methods:{
       async siguiente(){
            if(this.articulos.length>0){
                let infoeliminar={
                cod_art:this.articulos[0].COD_ART,
                dep_id:this.articulos[0].DEPOSITO
                }
                let infoaclaje={
                    cod_art:this.articulos[0].COD_ART,
                    dep_id:this.articulos[0].DEPOSITO,
                    art_id:this.artid,
                    ajuste:this.ajuste
                }
                let fecha = moment().format('DD-MM-YYYY')
                fecha = fecha.replace('-','.')
                fecha = fecha.replace('-','.')
                let infoajuste={
                    art_id:this.artid,
                    dep_id:this.articulos[0].DEPOSITO,
                    ajuste:this.ajuste,
                    fec_actual:fecha,
                    escala_id:this.escalaid,
                    stock_id:this.stkid
                }
                try {
                    this.cargando=true
                    let respajuste = await ApiServer.ajustarArticulo(infoajuste)
                    let resultaclaje = await ApiServer.aclajeajustes(infoaclaje)
                    let resulteliminar = await ApiServer.eliminarArticulo(infoeliminar)
                    let resultstock = await ApiServer.editarStock({art_id:this.artid, dep_id:this.articulos[0].DEPOSITO}) 
                    let resultarticulo = await ApiServer.editarArticulo(this.artid)
                    console.log(respajuste,resultaclaje,resulteliminar,resultstock,resultarticulo)
                    this.mensajeAjuste='Artículo ajustado con exito',
                    this.tipoMsjeAjuste='success',
                    this.alertAjuste=true
                    setTimeout(()=>{
                        this.alertAjuste=false
                    },3000)
                    this.articulos.shift();
                    this.codigo = this.articulos[0].COD_ART
                    this.componentKey +=1;
                    this.bloqueado=true
                    this.cargando=false
                } catch (error) {
                    console.log(error)
                    this.mensajeAjuste="Error al ajustar artículo"
                    this.tipoMsjeAjuste="error"
                    this.alertAjuste=true
                    setTimeout(()=>{
                        this.alertAjuste=false
                    },5000)
                    this.cargando=false
                }
            }
        },
        pasar(){
            this.dialogMotivos=true;
        },
        async aceptarMotivo(){
            this.dialogMotivos=false
            let info={
                art_id:this.artid,
                cod_art:this.articulos[0].COD_ART,
                usuario:sessionStorage.getItem("usuario"),
                motivo_id:this.motivoselected
            }
            let infoeliminar={
                cod_art:this.articulos[0].COD_ART,
                dep_id:this.articulos[0].DEPOSITO
            }
            try {
                this.cargando=true
                let resp = await ApiServer.artnoajustado(info)
                let result = await ApiServer.eliminarArticulo(infoeliminar)
                this.articulos.shift();
                this.codigo = this.articulos[0].COD_ART
                this.componentKey +=1;
                this.bloqueado=true
                console.log(resp,result)
                this.cargando=false
            } catch (error) {
                console.log(error)
                this.mensajeAjuste="Se produjo un error"
                this.tipoMsjeAjuste="error"
                this.alertAjuste=true
                setTimeout(()=>{
                    this.alertAjuste=false
                },5000)
                this.cargando=false
            }
        },
        pasarInfo(info){
            this.artid=info.art_id;
            this.stkid=info.stk_id;
            this.escalaid=info.escala_id;
        },
        agregarAjuste(cant){
            this.ajuste=cant
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