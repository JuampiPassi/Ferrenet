<template>
    <v-container>
        <v-card elevation="0" v-if="this.articulos.length>0">
            <v-card-text>
                <template v-if="this.articulos.length>0">
                    <Articulo2 :cod="this.codigo" :key="componentKey" @aceptar="siguiente($event)" @pasar="pasar()" @info="pasarInfo($event)"></Articulo2>
                </template>
            </v-card-text>
        </v-card>

        <v-alert class="mt-10"  elevation="24" dismissible :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
        <v-alert class=""  :type="tipoMsjeAjuste"  v-model="alertAjuste" dense dismissible transition="scale-transition">
            {{mensajeAjuste}}
        </v-alert>
        <v-alert class="mt-10" outlined elevation="24" type="info" color="orange"  v-model="alertCargando" dense transition="scale-transition">
            Cargando datos..
            <v-progress-circular class="mr-5" size="25" style="float: right;" indeterminate color="orange"></v-progress-circular>
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

        <v-card class="mt-5" v-if="this.finalizada"> 
                <v-card-title style="color:green">Política finalizada <v-icon class="ml-3" color="green">mdi-check</v-icon></v-card-title>
                <v-card-text>
                    Politica <b>{{id}}</b> finalizada
                </v-card-text>
                <v-card-actions>
                    <v-btn text outlined color="orange" @click="volver()">Volver</v-btn>
                </v-card-actions>
            </v-card>

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
            mensajeAjuste:'Artículo ajustado con exito',
            alertAjuste:false,
            tipoMsjeAjuste:'success',
            alertCargando:false,
            cargando:false,
            cargandoCprId:false,
            finalizada:false
        }
    },
    methods:{
       async siguiente(cant){
           this.ajuste=cant
            let infoeliminar={
            cod_art:this.articulos[0].COD_ART,
            dep_id:this.articulos[0].DEPOSITO
            }
            let infoaclaje={
                cod_art:this.articulos[0].COD_ART,
                dep_id:this.articulos[0].DEPOSITO,
                art_id:this.artid,
                ajuste:this.ajuste,
                usuario:sessionStorage.getItem("usuario"),
            }
            let fecha = moment().format('DD-MM-YYYY')
            fecha = fecha.replace('-','.')
            fecha = fecha.replace('-','.')
            let infoajuste={
                art_id:this.artid,
                dep_id:this.articulos[0].DEPOSITO,
                ajuste:this.ajuste,
                escala_id:this.escalaid,
                stock_id:this.stkid,
                cpr_id:sessionStorage.getItem("CprId")
            }
            if(!this.cargandoCprId){
                try {
                    this.cargando=true
                    let respajuste = await ApiServer.ajustarArticulo(infoajuste)
                    let resultaclaje = await ApiServer.aclajeajustes(infoaclaje)
                    let resulteliminar = await ApiServer.eliminarArticulo(infoeliminar)
                    let resultstock = await ApiServer.editarStock({art_id:this.artid, dep_id:this.articulos[0].DEPOSITO}) 
                    let resultarticulo = await ApiServer.editarArticulo(this.artid)
                    this.cargando=false
                    console.log(respajuste,resultaclaje,resulteliminar,resultstock,resultarticulo)
                    this.mensajeAjuste='Artículo ajustado con exito',
                    this.tipoMsjeAjuste='success',
                    this.alertAjuste=true
                    setTimeout(()=>{
                        this.alertAjuste=false
                    },3000)
                    this.articulos.shift();
                    if(this.articulos.length>0){
                        this.codigo = this.articulos[0].COD_ART
                        this.componentKey +=1;
                        this.bloqueado=true
                    }else{
                        this.finalizada=true
                    }
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
            }else{
                console.log("Cargando cpr id..")
            }
            
        },
        pasar(){
            this.motivoselected='';
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
                this.cargando=false
                this.articulos.shift();
                console.log(resp,result)
                if(this.articulos.length>0){
                    this.codigo = this.articulos[0].COD_ART
                    this.componentKey +=1;
                    this.bloqueado=true
                }else{
                    this.finalizada=true
                }
            } catch (error) {
                console.log(error)
                this.mensajeAjuste="Se produjo un error"
                this.tipoMsjeAjuste="error"
                this.alertAjuste=true
                this.finalizada=false
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
        volver(){
            this.$router.push({name: 'Politicas'});
        }
    },
    async mounted(){
        
        try {
            let resp = await ApiServer.verArticulos(this.id);
            this.motivos = await ApiServer.verMotivos();
            this.articulos = resp;
            this.codigo = this.articulos[0].COD_ART;
            console.log('articulos: ',resp)
            //Me fijo el dep_id y la fecha guardadas en el session storage
            let fechaCprid = sessionStorage.getItem("fechaCprid")
            let fecha = moment().format('DD-MM-YYYY')
            fecha = fecha.replace('-','.')
            fecha = fecha.replace('-','.')
            if(fechaCprid == undefined||fechaCprid == ''||fechaCprid !=fecha){
                sessionStorage.setItem("fechaCprid",fecha)
                this.alertCargando=true
                let resp = await ApiServer.getCprid(fecha,this.articulos[0].DEPOSITO)
                this.alertCargando=false
                sessionStorage.setItem("CprId",resp[0].CPR_ID)
                console.log("Cpr id cargado correctamente")
            }else if(sessionStorage.getItem("CprId")==undefined||sessionStorage.getItem("CprId")==''){
                this.alertCargando=true
                let resp = await ApiServer.getCprid(fecha,this.articulos[0].DEPOSITO)
                this.alertCargando=false
                sessionStorage.setItem("CprId",resp[0].CPR_ID)
                console.log("Cpr id cargado correctamente")
            }
        } catch (error) {
             this.alert=true
             this.mensaje="Se produjo un error"
             this.tipo="error"
             this.finalizada=false
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
                this.finalizada=true
            }
        }
    }
   

}
</script>

<style>

</style>