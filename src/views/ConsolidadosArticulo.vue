<template>
    <v-container>
        <template v-if="articulos!='' && !cargandoArticulo">
            <p class="font-weight-black" style="color:black">
                {{datosArt}}
            </p>
            <Imagen v-if="verimagen" :cod="articulos[0].cod_art" style="inline-size: fit-content;"/>
            <v-divider class="orange" dark></v-divider>
            <v-row class="mt-0">
                <v-col cols="11" class="text-center" style="padding:5px">
                    <p class="font-weight-black" style="font-size:20px">{{articulos[0].cod_art}}</p>
                </v-col>
            </v-row>
            <v-divider class="orange mb-5" dark></v-divider>
            <v-row>
                <v-col cols="11" class="text-center"  style="padding:5px">
                    <p class="font-weight-black ml-3 mb-0" style="font-size:16px">{{ean}}</p>
                    <p v-if="this.veriffail" class="ml-3 mb-0" style="font-size:20px;color:red">{{codeerror}}</p>
                </v-col>
                <v-col cols="1" style="padding:5px">
                    <v-icon v-if="this.verifok" class="float-right" style="margin-right: 15px" color="green">mdi-check-circle</v-icon> 
                    <v-icon v-if="this.veriffail" class="float-right" style="margin-right: 15px" color="red">mdi-close-circle</v-icon>   
                </v-col>
            </v-row>
            <v-divider class="orange mt-5 mb-5" dark></v-divider>
            <div class="text-center">
               <!-- <v-btn outlined small color="orange" @click="verifok=true">Habilitar</v-btn>-->
                <v-btn outlined small color="orange" class="ml-3" @click="verifok=true">Pasar</v-btn>
                <v-btn outlined small color="orange" class="ml-3" :disabled="!verifok" @click="aceptar()">Aceptar</v-btn>
                <v-btn @click="verbarcode=true" icon color="orange" class="ml-3"><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
            </div>
            <div class="mt-5">
                <v-simple-table dense>
                    <tbody>
                        <tr>
                            <td><p class="mb-0" style="font-size:20px; font-weight: bold;width: max-content;">Cantidad pedida</p></td>
                            <td>
                                <input style="font-size:20px; font-weight: bold; width:100%" type="number" v-model="nuevacant" :placeholder="cantidad"/>
                            </td>
                        </tr>
                        <tr>
                            <td>Stock</td>
                            <td>{{articulos[0].stock}}</td>
                        </tr>
                        <tr v-if="stockingreso>0">
                            <td style="font-weight: bold; color: red;">Stock Ingreso</td>
                            <td style="font-weight: bold; color: red;">{{stockingreso}}</td>
                        </tr>
                        <tr>
                            <td>Ubicación</td>
                            <td>{{articulos[0].orden_str}}</td>
                        </tr>
                        <tr>
                            <td>Empaque</td>
                            <td>{{articulos[0].empaque}}</td>
                        </tr>
                        <tr>
                            <td>Fec ctrl: <b>{{this.articulos[0].fec_ctrol}}</b></td>
                            <td>Fec ingr: <b>{{articulos[0].fec_ult_ingr}}</b></td>

                        </tr>
                        <tr>
                            <td>Arts. pendientes</td>
                            <td>{{articulos.length}}</td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </div>
        </template>
        
        <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
            <v-btn outlined small class="ml-5" @click="volver()">Volver</v-btn>
        </v-alert>
        <v-dialog v-model="verbarcode" scrollable transition="dialog-transition">
            <StreamBarcodeReader ref="scanner" v-if="this.verbarcode" @decode="code=> onDecodeBarCode(code)"></StreamBarcodeReader>
        </v-dialog>
        <v-overlay :value="cargando">
            <v-progress-circular
                indeterminate
                size="70"
                width="7"
            ></v-progress-circular>
        </v-overlay>
        <template v-if="cargandoArticulo">
            <v-row  class="fill-height" align-content="center" justify="center">
                <v-col
                class="text-subtitle-1 text-center"
                cols="12"
                >
                Cargando Artículo
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
    </v-container>
</template>

<script>
import ApiServer from '../api';
import Imagen from '../components/Imagen.vue'
import moment from 'moment';
import { StreamBarcodeReader } from "vue-barcode-reader";
export default {
    name:'ConsolidadosArticulo',
    components:{ Imagen, StreamBarcodeReader},
    data(){
        return{
            cons_id:'',
            alert:false,
            tipo:'error',
            mensaje:'',
            articulos:'',
            datosArt:'',
            cantidad:'',
            nuevacant:'',
            ean:'',
            art_id:'',
            stockingreso:'',
            codeerror:'',
            verifok:false,
            veriffail:false,
            verbarcode:false,
            cargando:false,
            verimagen:false,
            preparado:'',
            cargandoArticulo:false
        }
    },
    methods:{
        async aceptar(){
            this.cargando=true
            this.verimagen=false
            if(this.nuevacant=='')
                this.nuevacant=this.cantidad
            if(this.articulos[0].empaque!=0){
                this.preparado = this.nuevacant*this.articulos[0].empaque;
            }else{
                this.preparado = this.nuevacant;
            }
            let datos ={
                preparado: this.preparado,
                usuario: sessionStorage.getItem('usu_id'),
                cons_det_id: this.articulos[0].cons_det_id,
            }
            try {
                let resp = await ApiServer.putEditarLogisticaDet(datos)
                this.verifok=false
                this.nuevacant=''
                this.ean='',this.art_id='',this.datosArt=''
                this.cargando=false
                this.cargarArticulo()
            } catch (error) {
                this.cargando=false
                console.log(error)
                this.alert=true,
                this.tipo='error',
                this.mensaje="Se ha producido un error"
            }
        },
        async cargarArticulo(){
            this.cargandoArticulo=true
            try {
                this.articulos=''
                let resp = await ApiServer.getLogisticaConsDet(this.cons_id)
                console.log(resp)
                if(resp.length==0){
                    this.cargandoArticulo=false
                    this.alert=true,
                    this.tipo='warning',
                    this.mensaje="No se encontraron resultados"
                    setTimeout(()=>{
                    this.$router.push({name: 'Consolidados'});
                    },2000)
                }else{
                    this.articulos=resp
                    try {
                        let art = await ApiServer.buscarArticulo(this.articulos[0].cod_art)
                        this.ean = art[0].EAN
                        this.art_id = art[0].ART_ID
                        let stockingreso = await ApiServer.getStockIngreso(this.art_id)
                        if(stockingreso.length>0){
                            this.stockingreso = stockingreso[0].EXISTENCIA
                        }
                        try {//Se está visualizando el articulo
                            let datos={
                                cons_det_id: this.articulos[0].cons_det_id,
                                usuario: sessionStorage.getItem('usu_id')
                            }
                            await ApiServer.putVisualizando(datos)
                        } catch (error) {
                            this.cargandoArticulo=false
                            console.log(error)
                            this.alert=true,
                            this.tipo='error',
                            this.mensaje="Se ha producido un error"
                        }

                        this.datosArt=this.articulos[0].cod_art+"-"+this.articulos[0].descripcion
                        if(this.articulos[0].med!=''){
                            this.datosArt+="-"+this.articulos[0].med
                        }
                        if(this.articulos[0].MOD1!=''){
                            this.datosArt+="-"+this.articulos[0].MOD1
                        }
                        if(this.articulos[0].empaque!=0){
                            this.cantidad=this.articulos[0].cant_no_proc/this.articulos[0].empaque
                        }else{
                            this.cantidad=this.articulos[0].cant_no_proc
                        }
                        if(this.articulos[0].fec_ctrol){
                            this.articulos[0].fec_ctrol = moment(this.articulos[0].fec_ctrol).format('DD-MM-YYYY');
                        }
                        if(this.articulos[0].fec_ult_ingr){
                            this.articulos[0].fec_ult_ingr = moment(this.articulos[0].fec_ult_ingr).format('DD-MM-YYYY');  
                        }
                        this.verimagen=true
                        this.cargandoArticulo=false
                    } catch (error) {
                        this.cargandoArticulo=false
                        console.log(error)
                        this.alert=true,
                        this.tipo='error',
                        this.mensaje="Se ha producido un error"
                    }
                }
            } catch (error) {
                console.log(error)
                this.alert=true,
                this.tipo='error',
                this.mensaje="Se ha producido un error"
            }
        },
        onDecodeBarCode(code){
            this.veriffail=false
            this.verifok=false
            this.verbarcode=false
            this.$refs.scanner.codeReader.stream.getTracks().forEach(function (track) { track.stop() })
             if(this.ean==code){
                this.verifok=true
            }else{
                this.veriffail=true
                this.codeerror=code
            }
            
        },
        handler(event){
            if(this.articulos.length>0){
                let datos={
                 cons_det_id: this.articulos[0].cons_det_id,
                 usuario: 0
                 }
                 ApiServer.putVisualizando(datos) 
            }
        },
        volver(){
            this.$router.push({name: 'Consolidados'}); 
        },
       /* async Inicio(){
            try {
                this.articulos=''
                let resp = await ApiServer.getLogisticaConsDet(this.cons_id)
                console.log(resp)
                if(resp.length==0){
                    this.alert=true,
                    this.tipo='warning',
                    this.mensaje="No se encontraron resultados"
                }else{
                    this.articulos=resp
                    this.cargarArticulo()
                }
            } catch (error) {
                console.log(error)
                this.alert=true,
                this.tipo='error',
                this.mensaje="Se ha producido un error"
            }
        }*/

    },
    async mounted(){
        if(this.$route.params.id==undefined){
            this.$router.push({name: 'Consolidados'}); 
        }else{
            this.cons_id=this.$route.params.id
            this.cargarArticulo()
        }
    },
    destroyed(){
        if(this.articulos.length>0){
            let datos={
                 cons_det_id: this.articulos[0].cons_det_id,
                 usuario: 0
             }
             ApiServer.putVisualizando(datos)
        }
    },
    created(){
       window.addEventListener('beforeunload', this.handler)
    }
}
</script>

<style>

</style>