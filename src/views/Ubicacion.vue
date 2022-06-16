<template>
    <v-container>
        <v-card class="mt-5 text-center" elevation="0" v-if="escanear">
              <v-toolbar-title style="font-weight: 500;">Escanear Artículo</v-toolbar-title>
              <v-card-text>
                <v-btn  @click="activarBarcode()" icon color="orange" class="mr-10" ><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
                <v-btn  @click="activarQr()"  icon color="orange"><v-icon style="font-size:25px">mdi-qrcode-scan</v-icon></v-btn>
              </v-card-text>
            
          
        </v-card>
        <v-dialog v-model="verbarcode" scrollable transition="dialog-transition">
            <StreamBarcodeReader v-if="this.verbarcode" @decode="code=> onDecodeBarCode(code)"></StreamBarcodeReader>
        </v-dialog>
        <v-dialog v-model="verqr" scrollable transition="dialog-transition">
            <QrcodeStream v-if="this.verqr" @decode="onDecodeQr" @init="onInit" :torch="torchActive" :track="paintOutline">
                <v-btn icon color="orange" @click="torchActive = !torchActive" :disabled="torchNotSupported">
                    <v-icon dark>
                    {{flashIcon}}
                    </v-icon>
                </v-btn> 
            </QrcodeStream>
        </v-dialog>
    </v-container>
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader";
import { QrcodeStream } from 'vue-qrcode-reader';
import ApiServer from '../api';
export default {
    name:'Ubicacion',
    components:{StreamBarcodeReader,QrcodeStream },
    data(){
        return{
            verqr:false,
            verbarcode:false,
            torchActive: false,
            torchNotSupported: false,
            escanear:true
        }
    },
    methods:{
        activarBarcode(){
            this.verqr=false;
            if(this.verbarcode==true){
                this.verbarcode=false;
            }else this.verbarcode=true
        },
        activarQr(){
            this.verbarcode=false;
            if(this.verqr==true){
                this.verqr=false
            }else this.verqr=true
        },
        async onDecodeBarCode(code){
            this.verbarcode=false
            try {
                let result = await ApiServer.buscarArticuloporEan(code)
                console.log(result)
            } catch (error) {
                console.log(error)
            }
            
        },
        async onDecodeQr(decodedString){
            this.verqr=false
            try {
                let result = await ApiServer.buscarArticuloporEan(decodedString)
                console.log(result)
            } catch (error) {
                console.log(error)
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
}
</script>

<style>

</style>