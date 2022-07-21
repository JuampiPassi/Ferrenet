<template>
    <v-container>
        <v-row class="mt-5" style="align-items: baseline; justify-content: center;">
            <v-col cols="10" sm="5">
                <v-text-field :loading="boxLoading" color="orange" :error="boxError"  readonly v-model="codigoBox" label="Box Seleccionado"></v-text-field>
                <p style="color:green" v-if="boxAsignado==null"><b>Box Vacío</b></p>
                <p style="color:red" v-if="boxAsignado!=null && boxAsignado!=''"><b>Box ocupado por {{boxAsignado}}</b></p>
            </v-col>
            <v-col cols="2" sm="1">
                <v-btn  @click="verbarcode=true" icon color="orange" ><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
            </v-col>
        </v-row>
        <v-row style="align-items: baseline; justify-content: center;">
            <v-col cols="10" sm="5">
                <p>Selección de bultos</p>
                <v-progress-linear v-if="cargandoBulto" color="deep-orange accent-3" indeterminate rounded height="5"></v-progress-linear>
            </v-col>
            <v-col cols="2" sm="1">
                <v-btn :disabled="codigoBox==''"  @click="verbarcodeBultos=true" icon color="orange" ><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
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
        >
            <template v-slot:[`item.borrar`]="{item}">
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>

            </template>
        </v-data-table>

        <v-btn color="#ef6b01" class="mr-4 mt-5 mb-5" @click="guardar" v-if="this.filas.length>0&&this.codigoBox!=''">
            <b>Guardar</b>
        </v-btn>

        <v-alert style="word-break: normal" class="mt-10" text outlined type="error" v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
         <v-alert class="mt-10"  type="success"  v-model="alertGuardado" dense transition="scale-transition">
            Guardado
        </v-alert>

        <v-dialog v-model="verbarcode" scrollable transition="dialog-transition">
          <StreamBarcodeReader ref="scanner" v-if="this.verbarcode" @decode="code=> onDecodeBarCodeBox(code)" />
        </v-dialog>
        <v-dialog v-model="verbarcodeBultos" scrollable transition="dialog-transition">
          <StreamBarcodeReader ref="scanner" v-if="this.verbarcodeBultos" @decode="code=> onDecodeBarCodeBultos(code)" />
        </v-dialog>
        <v-overlay :value="cargando">
            <v-progress-circular
                indeterminate
                size="70"
                width="7"
            ></v-progress-circular>
        </v-overlay>
    </v-container>
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader";
import ApiServer from '../../api';
import moment from 'moment';
export default {
    components: {
    StreamBarcodeReader},
    name:'AsignarBox',
    data(){
        return{
            headers:[{text:'Cliente',value:'cliente'},{text:'Remito',value:'remito'},{text:'Bulto',value:'bulto',width:10},{text:'',value:'borrar',sortable:false,width:10}],
            filas:[],
            codigoBox:'',
            boxAsignado:'',
            boxAsignadoId:'',
            verbarcode:false,
            bulto:'',
            verbarcodeBultos:false,
            alert:false,
            mensaje:'',
            boxErrorMsje:"",
            boxError:false,
            boxLoading:false,
            cargandoBulto:false,
            cargando:false ,
            alertGuardado:false
        }
    },
    methods: {
        async onDecodeBarCodeBox(code){
            this.boxLoading=true
            this.alert=false
            this.boxError=false
            this.$refs.scanner.codeReader.stream.getTracks().forEach(function (track) { track.stop() })
            this.verbarcode=false
            this.codigoBox=code
            if(code!='' && code!=null && code!=undefined){
                try {
                    let result = await ApiServer.getBox(code)
                    if(result.length>0){
                        if(result[0].name!=null){
                            let pos = result[0].name.indexOf(" ")
                            this.boxAsignado=result[0].name.substring(pos+1)
                        }else{
                            this.boxAsignado=null
                        }
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
            }
        },
        async onDecodeBarCodeBultos(code){
            this.cargandoBulto=true
            this.alert=false
            this.$refs.scanner.codeReader.stream.getTracks().forEach(function (track) { track.stop() })
            this.verbarcodeBultos=false
            let pos = code.indexOf("-") 
            if(pos==-1){
                this.cargandoBulto=false
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
                    console.log(result)
                    this.cargandoBulto=false
                    if(result.length>0){
                        if(this.boxAsignado!=null && result[0].RZ!=this.boxAsignado){
                            this.alert=true
                            this.mensaje="Bulto no pertenece a "+this.boxAsignado
                            setTimeout(()=>{
                                this.alert=false
                            },5000)
                        }else if(this.boxAsignado==null && this.filas.length>0 && this.filas[0].cliente!=result[0].RZ){
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
                                cprdet_id:cprdet_id,
                                bulto:bulto,
                                cliente: result[0].RZ,
                                cod_cli: result[0].COD_CLI,
                                remito: result[0].NRO+"-"+result[0].NRO_CPR,
                                cpr_id: result[0].CPR_ID,
                                nro:result[0].NRO,
                                nro_cpr:result[0].NRO_CPR,

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
                    this.cargandoBulto=false
                    console.log(error)
                    this.alert=true
                    this.mensaje="Se ha producido un error"
                }
            }
        },
        async guardar(){
            this.cargando=true
            this.alert=false
            let datos=''
            let datos2=[]
            let fechahora = moment().format('YYYY-MM-DD hh:mm:ss')
            let fecha = moment().format('YYYY-MM-DD')
            this.filas.forEach(element => {
                datos+="("+`\'${element.cprdet_id}\'`+","+element.bulto+"),"
                let info={
                    id:this.codigoBox+element.cprdet_id+element.bulto,
                    name:element.remito+"-"+element.cliente,
                    fechahora:fechahora,
                    fecha: fecha,
                    nro_bulto:element.bulto,
                    cprdet_id:element.cprdet_id,
                    box:this.codigoBox,
                    cliente:element.cliente,
                    cpr_id:element.cpr_id,
                    nro:element.nro,
                    nro_cpr:element.nro_cpr
                }
                datos2.push(info)
            });
            datos = datos.slice(0,-1)

            try {
                let resp1 = await ApiServer.putAsignarBox({box_id:this.codigoBox,cliente:this.filas[0].cod_cli,fecha:moment().format('YYYY-MM-DD hh:mm:ss')})
                let resp2 = await ApiServer.deleteBoxRemito({datos:datos})
                let resp3 = await ApiServer.postBoxRemito(datos2)
                console.log(resp1)
                console.log(resp2)
                console.log(resp3)
                this.cargando=false
                this.filas=[], this.codigoBox='', this.boxAsignado=''
                this.alertGuardado=true
                setTimeout(()=>{
                    this.alertGuardado=false
                },3000)
            } catch (error) {
                this.cargando=false
                console.log(error)
                this.alert=true
                this.mensaje="Se ha producido un error"
            }
        },
        deleteItem(item){
            let index = this.filas.indexOf(item)
            this.filas.splice(index,1)
        }
    },
}
</script>

<style>

</style>