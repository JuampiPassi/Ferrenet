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
          <Articulo :cod="this.cod_art" :key="componentKey"></Articulo>
        </template>
        <QrcodeStream v-if="this.camara" @decode="onDecode"></QrcodeStream>
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
            componentKey:0
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
        }
    }
}
</script>

<style>

</style>