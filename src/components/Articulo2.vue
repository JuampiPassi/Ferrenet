<template>
    <v-container>
        <!-- *{padding=0%}-->
        <p class="font-weight-black" style="color:black">
            {{datos}}-{{posicion}}
        </p>
        <Imagen :cod="this.cod" style="inline-size: fit-content;"/>
        <v-divider class="orange mb-5" dark></v-divider>
        <v-row>
            <v-col>
                <p class="font-weight-black float-right mb-0" style="font-size:20px">{{ean}}</p>
                <p v-if="this.veriffail" class="float-right mb-0" style="font-size:20px;color:red">{{codeerror}}</p>
            </v-col>
            <v-col>
                <v-icon v-if="this.verifok" class="float-right" style="margin-right: 15px" color="green">mdi-check-circle</v-icon> 
                <v-icon v-if="this.veriffail" class="float-right" style="margin-right: 15px" color="red">mdi-close-circle</v-icon>   
            </v-col>
        </v-row>
        <v-divider class="orange mt-5 mb-5" dark></v-divider>
        <div class="text-center">
            <v-btn style="margin-right:50px;" large outlined color="orange" @click="activarBarcode()"><v-icon color="orange" style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
            <v-btn  large @click="activarQr()" outlined color="orange"><v-icon style="font-size:25px">mdi-qrcode-scan</v-icon></v-btn>
        </div>
        <div class="mt-5">
            <v-simple-table dense>
                <tbody>
                    <tr>
                        <td>Cantidad</td>
                        <td>
                            <input type="number" :value="this.cantidad" :readonly="!verifok"/>
                        </td>
                    </tr>
                    <tr>
                        <td>Stock</td>
                        <td>{{stock}}</td>
                    </tr>
                    <tr>
                        <td>Empaque</td>
                        <td>{{empaque}}</td>
                    </tr>
                    <tr v-if="this.fecha_ctrl">
                        <td>Fecha ctrl</td>
                        <td>{{fecha_ctrl}}</td>
                    </tr>
                </tbody>
            </v-simple-table>
        </div>
            
        <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
        <v-dialog v-model="verbarcode" scrollable transition="dialog-transition">
            <StreamBarcodeReader v-if="this.verbarcode" @decode="code=> onDecodeBarCode(code)"></StreamBarcodeReader>
        </v-dialog>
        <v-dialog v-model="verqr" scrollable transition="dialog-transition">
            <QrcodeStream v-if="this.verqr" @decode="onDecodeQr" @init="onInit" :torch="torchActive" :key="_uid" :track="paintOutline">
                <v-btn icon color="orange" @click="torchActive = !torchActive" :disabled="torchNotSupported">
                    <v-icon dark>
                    {{flashIcon}}
                    </v-icon>
                </v-btn>
                
            </QrcodeStream>
            <!--<v-alert class="mt-10"  type="error"  v-model="alertCamara" dense transition="scale-transition">
                {{mensajeCamara}}
            </v-alert>-->
        </v-dialog>
    </v-container>
</template>

<script>
import ApiServer from '../api';
import Imagen from './Imagen.vue'
import { StreamBarcodeReader } from "vue-barcode-reader";
import { QrcodeStream } from 'vue-qrcode-reader'
export default {
    name: 'Articulo2',
    components:{ Imagen,StreamBarcodeReader,QrcodeStream },
    props:{cod: {type: String}, escaner: {type: Boolean, default: true}},
    data(){
        return{
            datos:'',
            descripcion: '',
            ean: '',
            loading:false,
            articulo:'',
            medidas:'',
            empaque: '',
            mod:'',
            stock: '',
            cantidad:'',
            fecha_ctrl:'',
            posicion:'',
            barcode:'',
            verbarcode:false,
            verqr: false,
            alert:false,
            mensaje:'',
            tipo:'error',
            verifok:false,
            veriffail:false,
            nuevaCant:'',
            camera: 'rear',
            torchActive: false,
            torchNotSupported: false,
            alertCamara:false,
            mensajeCamara:'',
            codeerror:''

              
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
        onDecodeBarCode(code){
            this.veriffail=false
            this.verbarcode=false
             if(this.ean==code){
                this.verifok=true
                this.$emit('validado',true)
            }else{
                this.veriffail=true
                this.codeerror=code
            }
            
        },onDecodeQr(decodedString){
            this.verqr=false
            this.veriffail=false
            if(this.ean==decodedString){
                this.verifok=true
                this.$emit('validado',true)
                this.escaner=false
            }else{
              this.veriffail=true  
              this.codeerror=decodedString
            }
        },
        cambiarCamara(){
            this.alert=false
            switch (this.camera) {
                case 'front':
                this.camera = 'rear'
                break
                case 'rear':
                this.camera = 'front'
                break
            }
        },
        async onInit (promise) {
            try {
                const { capabilities } = await promise
                this.torchNotSupported = !capabilities.torch
            } catch (error) {
                const triedFrontCamera = this.camera === 'front'
                const triedRearCamera = this.camera === 'rear'

                const cameraMissingError = error.name === 'OverconstrainedError'

                if (triedRearCamera && cameraMissingError) {
                this.alertCamara=true;
                this.mensajeCamara="No se ha encontrado cámara trasera"
                }

                if (triedFrontCamera && cameraMissingError) {
                this.alertCamara=true;
                this.mensajeCamara="No se ha encontrado cámara frontal"
                }

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
    async mounted(){
       
        this.loading=true;
        try {
            let resp = await ApiServer.buscarArticulo(this.cod)
            this.loading=false;
            if(resp.length>0){

                this.articulo=resp;
                console.log(this.articulo[0])
                this.descripcion=resp[0].DESCRIPCION
                this.ean=resp[0].EAN
                this.medidas=resp[0].MED
                this.empaque=resp[0].CANT_EMPAQ
                this.mod=resp[0].MOD
                this.stock=resp[0].EXISTENCIA
                this.fecha_ctrl=resp[0].FECHA_CTRL
                this.posicion=resp[0].ORD_REC_STR
                if(this.empaque==0){
                    this.cantidad=this.stock
                }else{
                    this.cantidad=this.stock/this.empaque
                }
                this.nuevaCant=this.cantidad
                this.datos=this.cod+'-'+this.descripcion;
                if(this.medidas.length>0){
                    this.datos=this.datos+'-'+this.medidas;
                }
                if(this.mod.length>0){
                    this.datos=this.datos+'-'+this.mod;
                }
            }else{
                this.descripcion="Articulo no encontrado"
            }
            
            
        } catch (error) {
            this.loading=false;
            console.log(error)
        }   
        
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
    }

}
</script>

<style scoped>
*{
    padding: 0%;
}
.titulo1{
    word-break: normal;
    font-size: x-large;
}
.titulo2{
    word-break: normal;
}
.columnas{
    align-self: center;
}
.text-field{
    height:34px;
}

</style>