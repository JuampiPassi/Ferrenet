<template>
    <v-container>
        <template v-if="!loading">
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
                <v-btn outlined small color="orange" @click="pasar()">Pasar</v-btn>
                 <v-menu bottom offset-y max-width="63">
                    <template v-slot:activator="{ on, attrs  }">
                        <div class="split-btn">
                        <v-btn v-if="tipoescaner=='BARRA'" @click="activarBarcode()" icon color="orange" class="main-btn"><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
                        <v-btn v-if="tipoescaner=='QR'" @click="activarQr()"  icon color="orange"  class="main-btn"><v-icon style="font-size:25px">mdi-qrcode-scan</v-icon></v-btn>
                        <v-btn  v-on="on" v-bind="attrs" icon rounded color="orange" dark class="actions-btn"><v-icon left>mdi-menu-down</v-icon></v-btn>
                        </div>
                    </template>

                    <v-list>
                        <v-list-item-group >
                            <v-list-item v-if="tipoescaner=='BARRA'">
                                <v-list-item-icon @click="cambiartipoescaner()">
                                    <v-icon class="ml-5">mdi-qrcode-scan</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                            <v-list-item  v-if="tipoescaner=='QR'">
                                <v-list-item-icon @click="cambiartipoescaner()">
                                    <v-icon class="ml-5">mdi-barcode-scan</v-icon>
                                </v-list-item-icon>
                            
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-menu>
                <v-btn outlined small color="orange" :disabled="!verifok" @click="aceptar()">Aceptar</v-btn>
            </div>
            <div class="mt-5">
                <v-simple-table dense>
                    <tbody>
                        <tr>
                            <td>Cantidad</td>
                            <td>
                                <input type="number" v-model="nuevacant" :placeholder="cantidad" :readonly="!verifok"/>
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
            tipoescaner:'',
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
        cambiartipoescaner(){
            if(this.tipoescaner=='QR'){
                sessionStorage.setItem('escaner', "BARRA");
                this.tipoescaner='BARRA'
            }else{
                sessionStorage.setItem('escaner', "QR");
                this.tipoescaner='QR'
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
.main-btn{
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 2px !important;
    width: auto;
  }
  .actions-btn{
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding: 0 !important;
    min-width: 35px !important;
    margin-left: -3.5px;
  }
  .split-btn{
    display: inline-block;
    margin-left: 20px;
  }

</style>