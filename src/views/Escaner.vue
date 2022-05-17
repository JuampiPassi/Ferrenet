<template>
   <v-container>
     <div>
       <v-row>
         <v-col cols="12" class="text-center mt-5">
          <v-btn @click="camara=true, barcode='', articulo='', alert=false" v-if="!this.camara">
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
       <v-row v-if="this.articulo.length>0"> 
         <v-col>
            <v-text-field
              v-model="articulo[0].DESCRIPCION"
              label="Articulo"
              filled
              readonly
            ></v-text-field>
         </v-col>
       </v-row>
     </div>
        <StreamBarcodeReader v-if="this.camara" @decode="code=> onDecode(code)" @loaded="() =>onLoaded()"></StreamBarcodeReader>
        <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>

    </v-container>
</template>

<script>
import ApiServer from './../api';
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
          articulo: '',
          alert:false,
          mensaje: '',
          tipo:'error'
        }
    },
    methods: {
      async onDecode(code) {
        console.log(code);
        this.barcode = code;
        this.camara=false
        try {
          this.alert=false;
          let resp = await ApiServer.buscarArticuloporEan(this.barcode);
          this.articulo= resp;
          console.log(this.articulo)
          if(this.articulo.length==0){
            this.mensaje='Articulo no encontrado'
            this.tipo='warning'
            this.alert=true
          }
        } catch (error) {
          console.log(error)
          this.mensaje='Se ha producido un error'
          this.tipo='error'
          this.alert=true
        }

      
    },
    onLoaded() {
      console.log("load");
    },
    }
}
</script>
