<template>
    <v-container>
        <v-row>
         <v-col cols="12" class="text-center mt-5">
          <v-btn @click="camara=true, cod_art=''" v-if="!this.camara">
            <v-icon left>
              mdi-qrcode
            </v-icon> Escáner
          </v-btn>
         </v-col>
       </v-row>
        <v-row>
         <v-col cols="12" class="text-center" v-if="this.code!=''">
           <v-text-field
              v-model="code"
              label="Código"
              filled
              readonly
            ></v-text-field>
            
         </v-col>
       </v-row>
       <template v-if="this.cod_art!=''">
          <Articulo :cod="this.cod_art" :key="componentKey" :escaner='false'></Articulo>
        </template>
        <QrcodeStream v-if="this.camara" @decode="onDecode" :camera="camera" @init="onInit" :torch="torchActive" :key="_uid" :track="paintOutline" >
          <v-btn icon color="orange" @click="cambiarCamara()">
            <v-icon dark>
              mdi-camera-flip
            </v-icon>
          </v-btn>
        <v-btn icon color="orange" @click="torchActive = !torchActive" :disabled="torchNotSupported">
            <v-icon dark>
              {{flashIcon}}
            </v-icon>
          </v-btn>
        </QrcodeStream>
        <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
    </v-container>
</template>

<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import ApiServer from './../api';
import Articulo from '../components/Articulo.vue'
export default {
    name:'Qr',
    components:{QrcodeStream, Articulo},
    data(){
        return{
            camara: false,
            code: '',
            tipo:'error',
            alert:false,
            mensaje:'',
            cod_art:'',
            componentKey:0,
            camera: 'rear',
            torchActive: false,
            torchNotSupported: false
  
        }
    },
    methods:{
        async onDecode (decodedString){
           this.code= decodedString
           this.camara=false
           try {
            this.alert=false;
            let resp = await ApiServer.buscarArticuloporEan(this.code);
            if(resp.length==0){
              this.mensaje='Articulo no encontrado'
              this.tipo='warning'
              this.alert=true
            }else{

              this.cod_art= resp[0].COD_ART;
              this.componentKey +=1;
              console.log(this.cod_art)
            }
          } catch (error) {
            console.log(error)
            this.mensaje='Se ha producido un error'
            this.tipo='error'
            this.alert=true
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
              this.alert=true;
              this.tipo='error';
              this.mensaje="No se ha encontrado cámara trasera"
            }

            if (triedFrontCamera && cameraMissingError) {
              this.alert=true;
              this.tipo='error';
              this.mensaje="No se ha encontrado cámara frontal"
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
  computed: {
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