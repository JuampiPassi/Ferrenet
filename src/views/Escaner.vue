<template>
    <v-container>
      <v-card class="mt-5 text-center" elevation="0" v-if="articulo==''">
          <v-toolbar-title style="font-weight: 500;">Escanear Artículo</v-toolbar-title>
          <v-card-text>
              <v-btn  @click="verbarcode=true" icon color="orange" ><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
              <v-btn  @click="verqr=true" icon color="orange" class="ml-5"><v-icon style="font-size:28px">mdi-qrcode-scan</v-icon></v-btn>
          </v-card-text>
      </v-card>
      <v-dialog v-model="verbarcode" scrollable transition="dialog-transition">
          <StreamBarcodeReader ref="scanner" v-if="this.verbarcode" @decode="code=> onDecodeBarCode(code)" />
      </v-dialog>
      <v-dialog v-model="verqr" scrollable transition="dialog-transition">
        <QrcodeStream  @decode="onDecode"></QrcodeStream>
      </v-dialog>

      <template v-if="articulo!=''">
        <p class="font-weight-black" style="color:black">
              {{datosArticulo}}
          </p>
          <Imagen v-if="articulo!=''" :cod="this.articulo.COD_ART" style="inline-size: fit-content;"/>
          <v-divider class="orange" dark></v-divider>
          <v-row>
              <v-col cols="12" class="text-center">
                  <p class="font-weight-black ml-3 mb-0 mt-1" style="font-size:20px">{{articulo.ORD_REC_STR}}</p>
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
              <v-btn outlined small color="orange" class="ml-3" @click="clicatras()">Atrás</v-btn>
              <v-btn  @click="verbarcode=true" icon color="orange" class="ml-3"><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
              <v-btn  @click="verqr=true" icon color="orange" class="ml-3"><v-icon style="font-size:28px">mdi-qrcode-scan</v-icon></v-btn>
          </div>
            <div class="mt-5">
              <v-simple-table dense>
                  <tbody>
                      <tr>
                          <td>Cantidad</td>
                          <td>{{cantidad}}</td>
                      </tr>
                      <tr>
                          <td>Stock</td>
                          <td>{{articulo.EXISTENCIA}}</td>
                      </tr>
                      <tr>
                          <td>Empaque</td>
                          <td>{{articulo.CANT_EMPAQ}}</td>
                      </tr>
                      <tr v-if="this.articulo.FECHA_CTRL">
                          <td>Fecha ctrl</td>
                          <td>{{articulo.FECHA_CTRL}}</td>
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

        <v-alert class="mt-10" text outlined type="error" v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
    </v-container>
</template>

<script>
import ApiServer from './../api';
import Imagen from '../components/Imagen.vue';
import { StreamBarcodeReader } from "vue-barcode-reader";
import { QrcodeStream} from 'vue-qrcode-reader'
export default {
  name: 'Escaner',
  components: {
    StreamBarcodeReader,Imagen,QrcodeStream
  },
  data(){
        return{
          articulo: '',
          verbarcode:false,
          verqr:false,
          datosArticulo:'',
          ean:'',
          loadingArt:false,
          alert:false,
          mensaje:'',
          cantidad:''
        }
    },
    methods: {
      async onDecodeBarCode(code){
            this.articulo=''
            this.ean=code
            this.alert=false
            this.verbarcode=false
            this.$refs.scanner.codeReader.stream.getTracks().forEach(function (track) { track.stop() })
            try {
                this.loadingArt=true
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
        async onDecode (decodedString){
            this.articulo=''
            this.ean=decodedString
            this.alert=false
            this.verqr=false
            try {
                this.loadingArt=true
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
        clicatras(){
            this.$router.push({name: 'Home'})
        },
    }
}
</script>
