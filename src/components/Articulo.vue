<template>
    <v-container>
        <v-card
            :loading="loading"
            class="mx-auto my-12"
            max-width="374"
        >
            <template slot="progress">
                <v-progress-linear
                    color="#ef6b01"
                    height="5"
                    indeterminate
                ></v-progress-linear>
            </template>
            <Imagen :cod="this.cod"/>

            

            <v-card-title class="titulo2 text-center justify-center">{{descripcion}}</v-card-title>
            <v-divider class="mx-4"></v-divider>
            <v-card-title class="titulo1 justify-center font-weight-bold">Código: {{cod}}</v-card-title>
             <v-divider class="mx-4"></v-divider>
            <v-card-text>
                <h2 class="titulo2 text-center" v-if="this.mod!=''"><b>Mod: </b>{{mod}}</h2>
                <v-divider class="mx-4 mt-3 mb-3" v-if="this.mod!=''"></v-divider>
                <h2 class="titulo2 text-center"><b>Med: </b>{{medidas}}</h2>
                <v-divider class="mx-4 mt-3 mb-3"></v-divider>
                <h2 class="titulo2 text-center"><b>Empaque: </b>{{empaque}}</h2>
                <v-divider class="mx-4 mt-3 mb-3"></v-divider>
                <h2 class="titulo2 text-center"><b>Stock: </b>{{stock}}</h2>
                <v-divider class="mx-4 mt-3 mb-3"></v-divider>
                <template v-if="this.verif==false">
                    <h2 class="titulo2 text-center"><b>Cantidad: </b>{{cantidad}}</h2>
                </template>
                <template v-else>
                    <v-row>
                        <v-col cols="6" class="columnas" style="text-align-last: right;">
                             <h2 class="titulo2 text-center"><b>Cantidad: </b></h2>
                        </v-col>
                        <v-col cols="6" class="columnas">
                            <v-text-field dense v-model="nuevaCant" color="#ef6b01" class="text-field"></v-text-field>
                        </v-col>
                    </v-row>
                </template>
                <v-divider class="mx-4 mt-3 mb-3"></v-divider>
                <h2 class="titulo2 text-center"><b>EAN: </b>{{ean}}</h2>
                <v-divider class="mx-4 mt-3 mb-3"></v-divider>
                <h2 class="titulo2 text-center" v-if="this.fecha_ctrl!=''"><b>Fecha Ctrl: </b>{{fecha_ctrl}}</h2>
                <v-divider class="mx-4 mt-3 mb-3"></v-divider>
                <h2 class="titulo2 text-center" v-if="this.posicion!=''"><b>Posicion: </b>{{posicion}}</h2>
            </v-card-text>
                <v-divider class="mt-3 mb-3"></v-divider>
             <v-card-actions class="justify-center" v-if="escaner">
                    <!--<v-card-title>Escanear</v-card-title>-->
                    <v-btn style="margin-right:50px;" large outlined color="orange" @click="activarBarcode()"><v-icon left color="orange">mdi-barcode-scan</v-icon></v-btn>
                    <v-btn  large @click="activarQr()" outlined color="orange"><v-icon left>mdi-qrcode-scan</v-icon></v-btn>
                </v-card-actions>

        </v-card>
        <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
        <StreamBarcodeReader v-if="this.verbarcode" @decode="code=> onDecodeBarCode(code)"></StreamBarcodeReader>
        <QrcodeStream v-if="this.verqr" @decode="onDecodeQr"></QrcodeStream>
    </v-container>
</template>

<script>
import ApiServer from '../api';
import Imagen from '../components/Imagen.vue'
import { StreamBarcodeReader } from "vue-barcode-reader";
import { QrcodeStream } from 'vue-qrcode-reader'
export default {
    name: 'Articulo',
    components:{ Imagen,StreamBarcodeReader,QrcodeStream },
    props:{cod: {type: String}, escaner: {type: Boolean, default: true}},
    data(){
        return{
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
            posicion:'',
            barcode:'',
            verbarcode:false,
            verqr: false,
            alert:false,
            mensaje:'',
            tipo:'error',
            verif:false,
            nuevaCant:'',

              
        }
    },
    methods:{
        activarBarcode(){
            this.verqr=false;
            if(this.verbarcode==true){
                this.verbarcode=false;
            }else this.verbarcode=true
        },
        activarQr(){
            this.verbarcode=false;
            if(this.verqr==true){
                this.verqr=false
            }else this.verqr=true
        },
        onDecodeBarCode(code){
            console.log(code)
            this.verbarcode=false
        },onDecodeQr(decodedString){
            this.verqr=false;
            if(this.ean==decodedString){
                this.alert=true
                this.tipo='success'
                this.mensaje="Verificación Correcta"
                this.verif=true
                this.$emit('validado',true)
            }else{
                this.alert=true
                this.tipo='error'
                this.mensaje="Verificación Incorrecta"
            }
        }
        
    },
    async mounted(){
       
        this.loading=true;
        try {
            let resp = await ApiServer.buscarArticulo(this.cod)
            this.loading=false;
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
                this.posicion=resp[0].ORD_REC_STR
                if(this.empaque==0){
                    this.cantidad=this.stock
                }else{
                    this.cantidad=this.stock/this.empaque
                }
                this.nuevaCant=this.cantidad
            }else{
                this.descripcion="Articulo no encontrado"
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

<style>
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