<template>
   <v-container>
     <div>
       <v-row>
         <v-col cols="12" class="text-center mt-5">
          <v-btn @click="camara=true, barcode=''" v-if="!this.camara">
            <v-icon left>
              mdi-barcode-scan
            </v-icon> Escáner
          </v-btn>
         </v-col>
       </v-row>
       <v-row>
         <v-col cols="12" class="text-center" v-if="this.barcode!=''">
           <v-text-field
              v-model="barcode"
              label="Código"
              filled
              readonly
            ></v-text-field>
         </v-col>
       </v-row>
     </div>
      
      <StreamBarcodeReader v-if="this.camara" @decode="code=> onDecode(code)" @loaded="() =>onLoaded()"></StreamBarcodeReader>
    </v-container>
</template>

<script>

import { StreamBarcodeReader } from "vue-barcode-reader";
export default {
  name: 'Escaner',
  components: {
    StreamBarcodeReader,
  },
  data(){
        return{
          barcode: "",
          id: null, 
          camara: false,
        }
    },
    methods: {
      onDecode(code) {
        console.log(code);
        this.barcode = code;
        this.camara=false
    },
    onLoaded() {
      console.log("load");
    },
    }
}
</script>
