<template>
    <v-container>
        <v-row class="mt-5" style="align-items: baseline; justify-content: center;">
            <v-col cols="10" sm="5">
                <v-text-field :loading="boxLoading" color="orange" :error="boxError" :success="boxCorrecto"  readonly v-model="box" label="Box Seleccionado"></v-text-field>
                <p style="color:green"><b>Box Vacío</b></p>
                <p style="color:red"><b>Box ocupado por Chicho</b></p>
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

        <v-btn color="#ef6b01" class="mr-4 mt-5 mb-5" @click="guardar" v-if="this.filas.length>0&&this.box!=''">
            <b>Guardar</b>
        </v-btn>

        <v-alert style="word-break: normal" class="mt-10" text outlined type="error" v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>

        <v-dialog v-model="verbarcode" scrollable transition="dialog-transition">
          <StreamBarcodeReader ref="scanner" v-if="this.verbarcode" @decode="code=> onDecodeBarCodeBox(code)" />
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
            mensaje:'',
            boxErrorMsje:"",
            boxError:false,
            boxLoading:false,
            boxCorrecto:false
            
        }
    },
    methods: {
        async onDecodeBarCodeBox(code){
            this.boxLoading=true
            this.boxCorrecto=false
            this.alert=false
            this.boxError=false
            this.$refs.scanner.codeReader.stream.getTracks().forEach(function (track) { track.stop() })
            this.verbarcode=false
            this.box=code
            try {
                let result = await ApiServer.getBox(code)
                console.log(result)
                if(result.length>0){
                    this.boxCorrecto=true
                }else{
                   this.alert=true
                    this.mensaje="Código de box incorrecto" 
                    this.boxError=true
                }
                this.boxLoading=false
            } catch (error) {
                this.boxLoading=false
                console.log(error)
                this.alert=true
                this.mensaje="Se ha producido un error"
            }
        },
        async onDecodeBarCodeBultos(code){
            this.alert=false
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
                        if(this.filas.length>0 && result[0].RZ!=this.filas[0].cliente){
                            this.alert=true
                            this.mensaje="Bulto no pertenece a "+this.filas[0].cliente
                            setTimeout(()=>{
                                this.alert=false
                            },5000)
                        }else if(this.filas.length>0 && (this.filas.find(element=> element.codigo==code))!=undefined){
                            this.alert=true
                            this.mensaje="Ya se encuentra cargado"
                            setTimeout(()=>{
                                this.alert=false
                            },5000)
                        }else{
                            let datos ={
                                codigo:code,
                                cliente: result[0].RZ,
                                remito: result[0].NRO+"-"+result[0].NRO_CPR,
                                bulto: bulto
                            }
                            this.filas.push(datos)
                        }
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
        },
        guardar(){
            console.log('hola')
        }
    },
}
</script>

<style>

</style>