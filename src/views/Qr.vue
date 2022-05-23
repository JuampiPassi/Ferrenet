<template>
    <v-container>
        <v-row>
         <v-col cols="12" class="text-center mt-5">
          <v-btn @click="camara=true, code=''" v-if="!this.camara">
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
        <QrcodeStream v-if="this.camara" @decode="onDecode"></QrcodeStream>
    </v-container>
</template>

<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
export default {
    name:'Qr',
    components:{QrcodeStream},
    data(){
        return{
            camara: false,
            code: ''
        }
    },
    methods:{
        onDecode (decodedString){
           this.code= decodedString
           this.camara=false
        }
    }
}
</script>

<style>

</style>