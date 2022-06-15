<template>
    <v-container>
        <template v-if="!loading">
            <!-- *{padding=0%}-->
            <p class="font-weight-black" style="color:black">
                {{datos}}
            </p>
            <Imagen v-if="!loading" :cod="this.cod" style="inline-size: fit-content;"/>
            <v-divider class="orange" dark></v-divider>
            <v-row class="mt-2">
                <v-col cols="11" class="text-center">
                    <p class="font-weight-black ml-3" style="font-size:20px">{{posicion}}</p>
                </v-col>
            </v-row>
            <v-divider class="orange mb-5" dark></v-divider>
            <v-row>
                <v-col cols="11">
                    <p class="font-weight-black ml-3 mb-0" style="font-size:16px">{{ean}}</p>
                    <p v-if="this.veriffail" class="float-right mb-0" style="font-size:20px;color:red">{{codeerror}}</p>
                </v-col>
                <v-col cols="1">
                    <v-icon v-if="this.verifok" class="float-right" style="margin-right: 15px" color="green">mdi-check-circle</v-icon> 
                    <v-icon v-if="this.veriffail" class="float-right" style="margin-right: 15px" color="red">mdi-close-circle</v-icon>   
                </v-col>
            </v-row>
            <v-divider class="orange mt-5 mb-5" dark></v-divider>
            <div class="text-center">
                <v-btn outlined small color="orange" @click="pasar()">Pasar</v-btn>
                <v-btn outlined small color="orange" class="ml-3" :disabled="!verifok" @click="aceptar()">Aceptar</v-btn>
                <v-btn  @click="activarBarcode()" icon color="orange" class="ml-3"><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
                <v-btn  @click="activarQr()"  icon color="orange" class="ml-3"><v-icon style="font-size:25px">mdi-qrcode-scan</v-icon></v-btn>
            </div>
            <div class="mt-5">
                <v-simple-table dense>
                    <tbody>
                        <tr>
                            <td><p class="mb-0" style="font-size:20px; font-weight: bold;">Cantidad</p></td>
                            <td>
                                <input style="font-size:20px; font-weight: bold;" type="number" v-model="nuevacant" :placeholder="cantidad" :readonly="!verifok"/>
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
        </template>
        <template v-else>
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
            camera: 'rear',
            torchActive: false,
            torchNotSupported: false,
            alertCamara:false,
            mensajeCamara:'',
            codeerror:'',
            nuevacant:''

              
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
            this.verifok=false
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
            this.verifok=false
            if(this.ean==decodedString){
                this.verifok=true
                this.$emit('validado',true)
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
        pasar(){
            this.$emit('pasar')
        },
        aceptar(){
            if(this.nuevacant=='')
                this.nuevacant=this.cantidad
          
            if(this.empaque!=0){
                let ajuste=(this.nuevacant*this.empaque)-this.stock;
                this.$emit('aceptar',ajuste)
            }else{
                let ajuste=this.nuevacant-this.stock;
                this.$emit('aceptar',ajuste)
            }  
        }
        
    },
    async mounted(){
       
        this.loading=true;
        this.tipoescaner=sessionStorage.getItem("escaner");
        try {
            let resp = await ApiServer.buscarArticulo(this.cod)
            
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
                let info={art_id:this.articulo[0].ART_ID,stk_id:this.articulo[0].STK_ID, escala_id:this.articulo[0].ESCALA_ID}
                this.$emit('info',info)
                if(this.empaque==0){
                    this.cantidad=this.stock
                }else{
                    this.cantidad=this.stock/this.empaque
                }
                this.datos=this.cod+'-'+this.descripcion;
                if(this.medidas.length>0){
                    this.datos=this.datos+'-'+this.medidas;
                }
                if(this.mod.length>0){
                    this.datos=this.datos+'-'+this.mod;
                }
                this.loading=false;
            }else{
                this.descripcion="Articulo no encontrado"
                this.loading=false;
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