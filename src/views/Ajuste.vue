<template>
    <v-container>
         <v-card class="mt-5 text-center" elevation="0" v-if="articulo==''">
            <v-toolbar-title style="font-weight: 500;">Escanear Artículo</v-toolbar-title>
            <v-card-text>
                <v-btn  @click="verbarcode=true" icon color="orange"><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
            </v-card-text>
        </v-card>
        <v-dialog v-model="verbarcode" scrollable transition="dialog-transition">
            <StreamBarcodeReader ref="escaner" v-if="this.verbarcode" @decode="code=> onDecodeBarCode(code)" />
        </v-dialog>
        <v-alert class="mt-10" text outlined type="error" v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
        <v-alert class="mt-10" text dismissible outlined type="success" v-model="alertAjustado" dense transition="scale-transition">
            Artículo ajustado 
        </v-alert>
        <template v-if="loadingArt">
            <v-row  class="fill-height" align-content="center" justify="center">
                <v-col class="text-subtitle-1 text-center" cols="12">Buscando Artículo</v-col>
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

        <template v-if="articulo!=''">
            <p class="font-weight-black" style="color:black">
                {{datosArticulo}}
            </p>
            <Imagen v-if="articulo!=''" :cod="articulo.COD_ART" :key="componentKey" style="inline-size: fit-content;"/>
            <v-divider class="orange" dark></v-divider>
            <v-row class="mt--1">
                <v-col cols="12" class="text-center">
                    <p class="font-weight-black mb-0 mt-0" style="font-size:20px">{{posicion}}</p>
                </v-col>
            </v-row>
            <v-divider class="orange mb-2" dark></v-divider>
            <v-row>
                <v-col cols="12" class="text-center">
                    <p class="font-weight-black mb-0" style="font-size:16px">{{ean}}</p>
                </v-col>
            </v-row>
            <v-divider class="orange mt-1 mb-5" dark></v-divider>
            <div class="text-center">
                <v-btn outlined small color="orange" class="ml-3" @click="aceptar()">Aceptar</v-btn>
                <v-btn  @click="verbarcode=true" icon color="orange" class="ml-3"><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
            </div>
            <div class="mt-5">
                <v-simple-table dense>
                    <tbody>
                        <tr>
                            <td><p class="mb-0" style="font-size:20px; font-weight: bold;">Cantidad</p></td>
                            <td>
                                <input style="font-size:20px; font-weight: bold;" type="number" v-model="nuevacant" :placeholder="cantidad"/>
                            </td>
                        </tr>
                        <tr>
                            <td>Stock</td>
                            <td>{{articulo.EXISTENCIA}}</td>
                        </tr>
                        <tr>
                            <td>Empaque</td>
                            <td>{{articulo.CANT_EMPAQ}}</td>
                        </tr>
                        <tr v-if="articulo.FECHA_CTRL">
                            <td>Fecha ctrl</td>
                            <td>{{articulo.FECHA_CTRL}}</td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </div>
        </template>
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
import { StreamBarcodeReader } from "vue-barcode-reader";
import Imagen from '../components/Imagen.vue'
import moment from 'moment';
import ApiServer from '../api';
export default {
    name:'Ajuste',
    components:{StreamBarcodeReader, Imagen},
    data(){
        return{
            articulo:'',
            verbarcode:false,
            ean:'',
            alert:false,
            mensaje:'',
            datosArticulo:'',
            posicion:'',
            loadingArt:false,
            nuevacant:'',
            cantidad:'',
            componentKey:0,
            cargando:false,
            alertAjustado:false,

        }
    },
    methods:{
       async onDecodeBarCode(code){
            let tracks = this.$refs.escaner.codeReader.stream.getTracks();
            tracks.forEach((track) => {track.stop();});//Detiene la cámara
            this.ean=code
            this.alert=false,this.verbarcode=false
            this.articulo='',this.datosArticulo='',this.posicion='',this.nuevacant='',this.cantidad=''//reseteo los datos
            try {
                this.loadingArt=true
                let result = await ApiServer.buscarArticuloporEan(this.ean)
                console.log(result[0])
                this.loadingArt=false
                if(result.length>0){
                    this.articulo=result[0]
                    this.componentKey++//para que cambie la imagen
                    this.datosArticulo=this.articulo.COD_ART+'-'+this.articulo.DESCRIPCION;
                if(this.articulo.MED.length>0){
                    this.datosArticulo=this.datosArticulo+'-'+this.articulo.MED;
                }
                if(this.articulo.MOD.length>0){
                    this.datosArticulo=this.datosArticulo+'-'+this.articulo.MOD;
                }
                this.posicion=this.articulo.ORD_REC_STR
                if(this.articulo.CANT_EMPAQ==0){
                    this.cantidad=this.articulo.EXISTENCIA
                }else{
                    this.cantidad=this.articulo.EXISTENCIA/this.articulo.CANT_EMPAQ
                }
                }else{
                    this.alert=true,
                    this.mensaje='No se encontró articulo con EAN: '+this.ean
                }
            } catch (error) {
                this.loadingArt=false
                console.log(error)
                this.alert=true
                this.mensaje='Se ha producido un error'
            }
            
        },
        async aceptar(){
            this.cargando=true
            let ajuste=''
            let fecha = moment().format('DD-MM-YYYY')
            fecha = fecha.replace('-','.')
            fecha = fecha.replace('-','.')
            if(this.nuevacant=='')
                this.nuevacant=this.cantidad
            if(this.articulo.CANT_EMPAQ!=0){
                ajuste=(this.nuevacant*this.articulo.CANT_EMPAQ)-this.articulo.EXISTENCIA;
            }else{
                ajuste=this.nuevacant-this.articulo.EXISTENCIA;
            }  
            try {
                let resultcprid = await ApiServer.getCprid(fecha,1)
                let infoajuste={
                    art_id:this.articulo.ART_ID,
                    dep_id:1,
                    ajuste:ajuste,
                    escala_id:this.articulo.ESCALA_ID,
                    stock_id:this.articulo.STK_ID,
                    cpr_id:resultcprid[0].CPR_ID
                }
                console.log(infoajuste)
                let respajuste = await ApiServer.ajustarArticulo(infoajuste)
                let resultstock = await ApiServer.editarStock({art_id:this.articulo.ART_ID, dep_id:1}) 
                let resultarticulo = await ApiServer.editarArticulo(this.articulo.ART_ID)
                this.cargando=false
                this.articulo='',this.datosArticulo='',this.posicion='',this.nuevacant='',this.cantidad=''
                this.alertAjustado=true
                setTimeout(()=>{
                    this.alertAjustado=false
                },5000)
            } catch (error) {
                this.cargando=false
                console.log(error)
                this.alert=true
                this.mensaje='Se ha producido un error'
                setTimeout(()=>{
                    this.alert=false
                },5000)
                this.loading=false
            }
        }
    },
}
</script>

<style>

</style>