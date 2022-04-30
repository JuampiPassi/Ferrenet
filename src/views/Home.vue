<template>
   <v-container>
      <StreamBarcodeReader @decode="(a, b, c) => onDecode(a, b, c)" @loaded="() =>onLoaded()"></StreamBarcodeReader>
      Input Value: {{ text || "Nothing" }}
    </v-container>
</template>

<script>

import { StreamBarcodeReader } from "vue-barcode-reader";
export default {
  name: 'Home',
  components: {
    StreamBarcodeReader,
  },
  data(){
        return{
          text: "",
          id: null, 
        }
    },
    methods: {
       onDecode(a, b, c) {
      console.log(a, b, c);
      this.text = a;
      if (this.id) clearTimeout(this.id);
      this.id = setTimeout(() => {
        if (this.text === a) {
          this.text = "";
        }
      }, 5000);
    },
    onLoaded() {
      console.log("load");
    },
    }
}
</script>
