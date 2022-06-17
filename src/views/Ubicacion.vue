<template>
    <v-container>
        <v-card class="mt-5 text-center" elevation="0" v-if="articulo==''">
            <v-toolbar-title style="font-weight: 500;">Escanear Artículo</v-toolbar-title>
            <v-card-text>
                <v-btn  @click="activarBarcode()" icon color="orange" class="mr-10" ><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
                <v-btn  @click="activarQr()"  icon color="orange"><v-icon style="font-size:25px">mdi-qrcode-scan</v-icon></v-btn>
            </v-card-text>
        </v-card>
        <v-dialog v-model="verbarcode" scrollable transition="dialog-transition">
            <StreamBarcodeReader ref="scanner" v-if="this.verbarcode" @decode="code=> onDecodeBarCode(code)" />
        </v-dialog>
        <v-dialog v-model="verqr" scrollable transition="dialog-transition">
            <QrcodeStream v-if="this.verqr" @decode="onDecodeQr" @init="onInit" :torch="torchActive" :key="_uid" :track="paintOutline">
                <v-btn icon color="orange" @click="torchActive = !torchActive" :disabled="torchNotSupported">
                    <v-icon dark>
                    {{flashIcon}}
                    </v-icon>
                </v-btn> 
            </QrcodeStream>
        </v-dialog>

        <template v-if="articulo!=''">
            <p class="font-weight-black" style="color:black">
                {{datosArticulo}}
            </p>
            <Imagen v-if="articulo!=''" :cod="this.articulo.COD_ART" style="inline-size: fit-content;"/>
            <v-divider class="orange" dark></v-divider>
            <v-row>
                <v-col cols="12" class="text-center">
                    <p class="font-weight-black ml-3 mb-0 mt-1" style="font-size:20px">{{posicion}}</p>
                </v-col>
            </v-row>
            <v-divider class="orange mb-2 mt-2" dark></v-divider>
            <v-row>
                <v-col cols="12" class="text-center">
                    <p class="font-weight-black ml-3 mb-0" style="font-size:16px">{{ean}}</p>
                </v-col>
            </v-row>
            <v-divider class="orange mt-2 mb-5" dark></v-divider>
            <div class="text-center">
                <v-btn outlined small color="orange">Aceptar</v-btn>
                <v-btn outlined small color="orange" class="ml-3">Atrás</v-btn>
            </div>
            <div class="mt-5">
                <v-simple-table dense>
                    <tbody>
                        <tr>
                            <td><p class="mb-0" style="font-size:18px; font-weight: bold;">Sector</p></td>
                            <td>
                                <input style="font-size:18px; font-weight: bold;" type="text" v-model="nuevosector" :placeholder="posicion" />
                            </td>
                        </tr>
                        <tr>
                            <td><p class="mb-0" style="font-size:18px; font-weight: bold;">Módulo</p></td>
                            <td>
                                <input style="font-size:18px; font-weight: bold;" type="number" v-model="nuevomodulo" />
                            </td>
                        </tr>
                        <tr>
                            <td><p class="mb-0" style="font-size:18px; font-weight: bold;">Estante</p></td>
                            <td>
                                <input style="font-size:18px; font-weight: bold;" type="number" v-model="nuevoestante" />
                            </td>
                        </tr>
                        <tr>
                            <td><p class="mb-0" style="font-size:18px; font-weight: bold;">Posición</p></td>
                            <td>
                                <input style="font-size:18px; font-weight: bold;" type="number" v-model="nuevapos" />
                            </td>
                        </tr>
                    </tbody>
                </v-simple-table>
                       
            </div>
        </template>
        <template v-if="loadingArt">
            <v-row  class="fill-height" align-content="center" justify="center">
                <v-col
                class="text-subtitle-1 text-center"
                cols="12"
                >
                Buscando Artículo
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

        <v-alert class="mt-10" text outlined type="error"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>

    </v-container>
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader";
import { QrcodeStream } from 'vue-qrcode-reader';
import Imagen from '../components/Imagen.vue'
import ApiServer from '../api';
export default {
    name:'Ubicacion',
    components:{Imagen,StreamBarcodeReader,QrcodeStream },
    data(){
        return{
            verqr:false,
            verbarcode:false,
            torchActive: false,
            torchNotSupported: false,
            escanear:true,
            loadingArt:false,
            articulo:'',
            datosArticulo:'',
            posicion:'',
            ean:'',
            alert:false,
            mensaje:'',
            nuevosector:'',
            nuevomodulo:'',
            nuevoestante:'',
            nuevapos:''
        }
    },
    methods:{
        activarBarcode(){
            this.verqr=false;
            this.verbarcode=true
        },
        activarQr(){
            this.verbarcode=false;
            if(this.verqr==true){
                this.verqr=false
            }else this.verqr=true
        },
        async onDecodeBarCode(code){
            this.ean=code
            this.alert=false
            this.verbarcode=false
            this.$refs.scanner.codeReader.stream.getTracks().forEach(function (track) { track.stop() })
            try {
                this.loadingArt=true
                this.escanear=false
                let result = await ApiServer.buscarArticuloporEan(this.ean)
                this.loadingArt=false
                if(result.length>0){
                    this.articulo=result[0]
                    this.datosArticulo=this.articulo.COD_ART+'-'+this.articulo.DESCRIPCION;
                if(this.articulo.MED.length>0){
                    this.datosArticulo=this.datosArticulo+'-'+this.articulo.MED;
                }
                if(this.articulo.MOD.length>0){
                    this.datosArticulo=this.datosArticulo+'-'+this.articulo.MOD;
                }
                this.posicion=this.articulo.ORD_REC_STR
                }else{
                    this.alert=true,
                    this.mensaje='No se encontró articulo con EAN: '+this.ean
                }
            } catch (error) {
                console.log(error)
                this.alert=true
                this.mensaje='Se ha producido un error'
            }
            
        },
        async onDecodeQr(decodedString){
            this.ean=decodedString
            this.alert=false
            this.verqr=false
            try {
                this.loadingArt=true
                this.escanear=false
                let result = await ApiServer.buscarArticuloporEan(this.ean)
                this.loadingArt=false
                if(result.length>0){
                    this.articulo=result[0]
                    this.datosArticulo=this.articulo.COD_ART+'-'+this.articulo.DESCRIPCION;
                if(this.articulo.MED.length>0){
                    this.datosArticulo=this.datosArticulo+'-'+this.articulo.MED;
                }
                if(this.articulo.MOD.length>0){
                    this.datosArticulo=this.datosArticulo+'-'+this.articulo.MOD;
                }
                this.posicion=this.articulo.ORD_REC_STR
                }else{
                    this.alert=true,
                    this.mensaje='No se encontró articulo con EAN: '+this.ean
                }
            } catch (error) {
                console.log(error)
                this.alert=true
                this.mensaje='Se ha producido un error'
            }
        },
        async onInit (promise) {
            try {
                const { capabilities } = await promise
                this.torchNotSupported = !capabilities.torch
            } catch (error) {
                console.error(error)
            }
        },
        paintOutline (detectedCodes, ctx) {
            for (const detectedCode of detectedCodes) {
                const [ firstPoint, ...otherPoints ] = detectedCode.cornerPoints

                ctx.strokeStyle = "red";

                ctx.beginPath();
                ctx.moveTo(firstPoint.x, firstPoint.y);
                for (const { x, y } of otherPoints) {
                ctx.lineTo(x, y);
                }
                ctx.lineTo(firstPoint.x, firstPoint.y);
                ctx.closePath();
                ctx.stroke();
            }
        },
    },
    computed:{
        flashIcon() {
            if (this.torchActive)
                return 'mdi-flashlight-off'
            else
                return 'mdi-flashlight'
        }
    },
    watch:{
        verbarcode(){
            if(this.verbarcode==false){
                this.$refs.scanner.codeReader.stream.getTracks().forEach(function (track) { track.stop() })
            }
        }
    }
}
</script>

<style scoped>

</style>