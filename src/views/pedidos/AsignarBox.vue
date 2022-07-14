<template>
    <v-container>
        <v-row class="mt-5" style="align-items: baseline; justify-content: center;">
            <v-col cols="10" sm="5">
                <v-text-field color="orange" v-model="box" label="Box Seleccionado"></v-text-field>
            </v-col>
            <v-col cols="2" sm="1">
                <v-btn  @click="verbarcode=true" icon color="orange" ><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
            </v-col>
        </v-row>
        <v-row style="align-items: baseline; justify-content: center;">
            <v-col cols="10" sm="5">
                <p>Selección de bultos</p>
            </v-col>
            <v-col cols="2" sm="1">
                <v-btn  @click="verbarcodeBultos=true" icon color="orange" ><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
            </v-col>
        </v-row>
        <v-data-table
            v-if="this.filas.length>0"
            :mobile-breakpoint="400"
            :headers="headers"
            :items="filas"
            :items-per-page="5"
            class="elevation-1"
            locale="es"
            :disable-sort="true"
            :hide-default-footer="true"
        ></v-data-table>

        <v-alert class="mt-10" text outlined type="error" v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>

        <v-dialog v-model="verbarcode" scrollable transition="dialog-transition">
          <StreamBarcodeReader ref="scanner" v-if="this.verbarcode" @decode="code=> onDecodeBarCode(code)" />
        </v-dialog>
        <v-dialog v-model="verbarcodeBultos" scrollable transition="dialog-transition">
          <StreamBarcodeReader ref="scanner" v-if="this.verbarcodeBultos" @decode="code=> onDecodeBarCodeBultos(code)" />
        </v-dialog>
    </v-container>
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader";
import ApiServer from '../../api';
export default {
    components: {
    StreamBarcodeReader},
    name:'AsignarBox',
    data(){
        return{
            headers:[{text:'Cliente',value:'cliente'},{text:'Remito',value:'remito'},{text:'Bulto',value:'bulto'}],
            filas:[],
            box:'',
            verbarcode:false,
            bulto:'',
            verbarcodeBultos:false,
            alert:false,
            mensaje:''
        }
    },
    methods: {
        onDecodeBarCode(code){
            this.$refs.scanner.codeReader.stream.getTracks().forEach(function (track) { track.stop() })
            this.verbarcode=false
            this.box=code
        },
        async onDecodeBarCodeBultos(code){
            this.$refs.scanner.codeReader.stream.getTracks().forEach(function (track) { track.stop() })
            this.verbarcodeBultos=false
            let pos = code.indexOf("-") 
            console.log(pos)
            if(pos==-1){
                this.alert=true
                this.mensaje="Código no valido"
                setTimeout(()=>{
                    this.alert=false
                },5000)
            }else{
                let cprdet_id = code.substring(0,pos)
                let bulto = code.substring(pos+1)
                try {
                    let result = await ApiServer.getRemito(cprdet_id)
                    if(result.length>0){
                        console.log(result)
                        let datos ={
                            cliente: result[0].RZ,
                            remito: result[0].NRO+"-"+result[0].NRO_CPR,
                            bulto: bulto
                        }
                        this.filas.push(datos)
                    }else{
                        this.alert=true
                        this.mensaje="No se encontraron resultados"
                        setTimeout(()=>{
                            this.alert=false
                        },5000)
                    }
                } catch (error) {
                    console.log(error)
                    this.alert=true
                    this.mensaje="Se ha producido un error"
                }
            }
        }
    }
}
</script>

<style>

</style>