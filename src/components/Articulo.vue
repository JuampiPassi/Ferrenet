<template>
    <v-container>
        <template v-if="!loading">
            <!-- *{padding=0%}-->
            <p class="font-weight-black" style="color:black">
                {{datos}}
            </p>
            <Imagen v-if="verimagen" :cod="this.cod" style="inline-size: fit-content;"/>
            <v-divider class="orange" dark></v-divider>
            <v-row class="mt-2">
                <v-col cols="11" class="text-center">
                    <p class="font-weight-black ml-3" style="font-size:20px">{{posicion}}</p>
                </v-col>
            </v-row>
            <v-divider class="orange mb-5" dark></v-divider>
            <v-row>
                <v-col cols="11" class="text-center">
                    <p class="font-weight-black ml-3 mb-0" style="font-size:16px">{{ean}}</p>
                    <p v-if="this.veriffail" class="ml-3 mb-0" style="font-size:20px;color:red">{{codeerror}}</p>
                </v-col>
                <v-col cols="1">
                    <v-icon v-if="this.verifok" class="float-right" style="margin-right: 15px" color="green">mdi-check-circle</v-icon> 
                    <v-icon v-if="this.veriffail" class="float-right" style="margin-right: 15px" color="red">mdi-close-circle</v-icon>   
                </v-col>
            </v-row>
            <v-divider class="orange mt-5 mb-5" dark></v-divider>
            <div class="text-center">
                <v-btn outlined small color="orange" @click="verifok=true">Habilitar</v-btn>
                <v-btn outlined small color="orange" class="ml-3" @click="pasar()">Pasar</v-btn>
                <v-btn outlined small color="orange" class="ml-3" :disabled="!verifok" @click="aceptar()">Aceptar</v-btn>
                <v-btn  @click="verbarcode=true" icon color="orange" class="ml-3"><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
            </div>
            <div class="mt-5">
                <v-simple-table dense>
                    <tbody>
                        <tr>
                            <td><p class="mb-0" style="font-size:20px; font-weight: bold;">Cantidad</p></td>
                            <td>
                                <v-text-field autofocus dense flat color="orange" style="font-size:20px; font-weight: bold; width:30%; height: inherit;" type="number" v-model="nuevacant" :placeholder="cantidad" :readonly="!verifok"/>
                            </td>
                        </tr>
                        <tr>
                            <td>Stock</td>
                            <td>{{stock}}</td>
                        </tr>
                        <tr>
                            <td>Empaque</td>
                            <td>{{empaque}}</td>
                        </tr>
                        <tr v-if="fecha_ctrl!=null && fec_ingreso!=null">
                            <td style="width: 10px;">Fec ctrl: <b>{{fecha_ctrl}}</b></td>
                            <td style="width: 150px">Fec ingr: <b>{{fec_ingreso}}</b></td>
                        </tr>
                        <tr v-if="fecha_ctrl!=null && fec_ingreso==null">
                            <td style="width: 10px;">Fec ctrl:</td>
                            <td><b>{{fecha_ctrl}}</b></td>
                        </tr>
                        <tr v-if="fec_ingreso!=null && fecha_ctrl==null">
                            <td style="width: 10px;">Fec ingr:</td>
                            <td><b>{{fec_ingreso}}</b></td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </div>
        </template>
        <template v-else>
            <v-row  class="fill-height" align-content="center" justify="center">
                <v-col
                class="text-subtitle-1 text-center"
                cols="12"
                >
                Cargando Artículo
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
            
        <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
        <v-dialog v-model="verbarcode" scrollable transition="dialog-transition">
            <StreamBarcodeReader ref="scanner" v-if="this.verbarcode" @decode="code=> onDecodeBarCode(code)"></StreamBarcodeReader>
        </v-dialog>
    </v-container>
</template>

<script>
import ApiServer from '../api';
import Imagen from './Imagen.vue'
import { StreamBarcodeReader } from "vue-barcode-reader";
import { QrcodeStream } from 'vue-qrcode-reader'
import moment from 'moment';
export default {
    name: 'Articulo',
    components:{ Imagen,StreamBarcodeReader,QrcodeStream },
    props:{cod: {type: String}},
    data(){
        return{
            datos:'',
            descripcion: '',
            ean: '',
            loading:false,
            articulo:'',
            medidas:'',
            empaque: '',
            mod:'',
            stock: '',
            cantidad:'',
            fecha_ctrl:'',
            fec_ingreso:'',
            posicion:'',
            barcode:'',
            verbarcode:false,
            alert:false,
            mensaje:'',
            tipo:'error',
            verifok:false,
            veriffail:false,
            alertCamara:false,
            mensajeCamara:'',
            codeerror:'',
            nuevacant:'',
            verimagen:false

              
        }
    },
    methods:{
        onDecodeBarCode(code){
            this.veriffail=false
            this.verifok=false
            this.verbarcode=false
            this.$refs.scanner.codeReader.stream.getTracks().forEach(function (track) { track.stop() })
             if(this.ean==code){
                this.verifok=true
                this.$emit('validado',true)
            }else{
                this.veriffail=true
                this.codeerror=code
            }
            
        },
        pasar(){
            this.$emit('pasar')
        },
        aceptar(){
            if(sessionStorage.getItem("CprId")==undefined||sessionStorage.getItem("CprId")==''){
                this.alert=true
                this.mensaje="No se ha podido cargar CPR_ID"
                this.tipo="error"
            }else{

                if(this.nuevacant=='')
                    this.nuevacant=this.cantidad
              
                if(this.empaque!=0){
                    let ajuste=(this.nuevacant*this.empaque)-this.stock;
                    //this.$emit('aceptar',ajuste)
                    console.log(ajuste)
                }else{
                    let ajuste=this.nuevacant-this.stock;
                   // this.$emit('aceptar',ajuste)
                   console.log(ajuste)
                }  
            }
        }
        
    },
    async mounted(){
       
        this.loading=true;
        try {
            let resp = await ApiServer.buscarArticulo(this.cod)
            
            if(resp.length>0){

                this.articulo=resp;
                console.log(this.articulo[0])
                this.descripcion=resp[0].DESCRIPCION
                this.ean=resp[0].EAN
                this.medidas=resp[0].MED
                this.empaque=resp[0].CANT_EMPAQ
                this.mod=resp[0].MOD
                this.stock=resp[0].EXISTENCIA
                this.fecha_ctrl=resp[0].FECHA_CTRL
                if(this.fecha_ctrl!=null)
                this.fecha_ctrl=(moment(this.fecha_ctrl).format('DD-MM-YY'))
                this.posicion=resp[0].ORD_REC_STR
                let info={art_id:this.articulo[0].ART_ID,stk_id:this.articulo[0].STK_ID, escala_id:this.articulo[0].ESCALA_ID}
                this.$emit('info',info)
                if(this.empaque==0){
                    this.cantidad=this.stock
                }else{
                    this.cantidad=this.stock/this.empaque
                }
                this.datos=this.cod+'-'+this.descripcion;
                if(this.medidas.length>0){
                    this.datos=this.datos+'-'+this.medidas;
                }
                if(this.mod.length>0){
                    this.datos=this.datos+'-'+this.mod;
                }
                let fechaingreso = await ApiServer.verFecIngreso(this.articulo[0].ART_ID);
                this.fec_ingreso= fechaingreso[0].FEC_INGRESO
                if(this.fec_ingreso!=null)
                this.fec_ingreso=(moment(this.fec_ingreso).format('DD-MM-YY'))
                this.loading=false;
                this.verimagen=true
            }else{
                this.descripcion="Articulo no encontrado"
                this.loading=false;
            }
        } catch (error) {
            this.loading=false;
            console.log(error)
        }   
        
    },
    computed:{
    },
    watch:{
    }

}
</script>

<style scoped>
*{
    padding: 0%;
}
.titulo1{
    word-break: normal;
    font-size: x-large;
}
.titulo2{
    word-break: normal;
}
.columnas{
    align-self: center;
}
.text-field{
    height:34px;
}


</style>