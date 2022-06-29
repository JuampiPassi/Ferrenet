<template>
    <v-container>
        <template v-if="articulos!=''">
            <p class="font-weight-black" style="color:black">
                {{datosArt}}
            </p>
            <Imagen :cod="articulos[0].cod_art" style="inline-size: fit-content;"/>
            <v-divider class="orange" dark></v-divider>
            <v-row class="mt-0">
                <v-col cols="11" class="text-center" style="padding:5px">
                    <p class="font-weight-black" style="font-size:20px">{{articulos[0].orden_str}}</p>
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
                            <td><p class="mb-0" style="font-size:20px; font-weight: bold;">Cantidad</p></td>
                            <td>
                                <input style="font-size:20px; font-weight: bold; width:100%" type="number" v-model="nuevacant" :placeholder="cantidad"/>
                            </td>
                        </tr>
                        <tr>
                            <td>Stock</td>
                            <td>{{articulos[0].stock}}</td>
                        </tr>
                        <tr>
                            <td>Stock Ingreso</td>
                            <td>{{stockingreso}}</td>
                        </tr>
                        <tr>
                            <td>Empaque</td>
                            <td>{{articulos[0].empaque}}</td>
                        </tr>
                        <tr v-if="articulos[0].fec_ctrol || articulos[0].fec_ult_ingr">
                            <template v-if="articulos[0].fec_ctrol">
                                <td style="width: 10%;">Fec ctrl</td>
                                
                                <td style="width: 90px;">{{this.articulos[0].fec_ctrol}}</td>
                            </template>
                            <template v-if="articulos[0].fec_ult_ingr">
                                <td style="width: 83px;">Fec ingr</td>
                                <td >{{ articulos[0].fec_ult_ingr}}</td>
                            </template>
                        </tr>
                    </tbody>
                </v-simple-table>
            </div>
        </template>
        
        <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
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
            id:this.$route.params.id,
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
            cargando:false
        }
    },
    methods:{
        async aceptar(){
            this.cargando=true
            if(this.nuevacant=='')
                this.nuevacant=this.cantidad
            /*if(this.articulos[0].empaque!=0){
                preparado = this.nuevacant*this.articulos[0].empaque;
            }else{
                preparado = this.nuevacant;
            }  
            console.log(preparado)*/
            let datos ={
                preparado: this.nuevacant,
                usuario: sessionStorage.getItem('usu_id'),
                cons_det_id: this.articulos[0].cons_det_id,
            }
            try {
                let resp = await ApiServer.putEditarLogisticaDet(datos)
                this.articulos.shift();
                if(this.articulos.length>0){
                       this.verifok=false
                       this.nuevacant=''
                       this.ean='',this.art_id=''
                       this.cargarArticulo()
                       this.cargando=false
                    }else{
                        this.$router.push({name: 'Consolidados'}); 
                    }
            } catch (error) {
                this.cargando=false
                console.log(error)
                this.alert=true,
                this.tipo='error',
                this.mensaje="Se ha producido un error"
            }
        },
        async cargarArticulo(){
            try {
                let art = await ApiServer.buscarArticulo(this.articulos[0].cod_art)
                console.log(art)
                this.ean = art[0].EAN
                this.art_id = art[0].ART_ID
                let stockingreso = await ApiServer.getStockIngreso(this.art_id)
                this.stockingreso = stockingreso[0].EXISTENCIA
                console.log(this.stockingreso)
            } catch (error) {
                console.log(error)
                this.alert=true,
                this.tipo='error',
                this.mensaje="Se ha producido un error"
            }
            try {//Se está visualizando el articulo
                let datos={
                    cons_det_id: this.articulos[0].cons_det_id,
                    usuario: sessionStorage.getItem('usu_id')
                }
                await ApiServer.putVisualizando(datos)
            } catch (error) {
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
                this.articulos[0].fec_ctrol = moment(this.articulos[0].fec_ctrol).format('DD-MM-YY');
            }
            if(this.articulos[0].fec_ult_ingr){
                this.articulos[0].fec_ult_ingr = moment(this.articulos[0].fec_ult_ingr).format('DD-MM-YY');  
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
        }
    },
    async mounted(){
        if(this.$route.params.id==undefined){
            this.$router.push({name: 'Consolidados'}); 
        }else{
            try {
                let resp = await ApiServer.getLogisticaConsDet(this.$route.params.id)
                console.log(resp)
                if(resp.lenght==0){
                    this.alert=true,
                    this.tipo='error',
                    this.mensaje="No se encontraron artículos"
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