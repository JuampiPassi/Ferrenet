<template>
    <v-container>
        <v-card class="mt-5 text-center" elevation="0" v-if="articulo==''">
            <v-toolbar-title style="font-weight: 500;">Escanear Artículo</v-toolbar-title>
            <v-card-text>
                <v-btn  @click="verbarcode=true" icon color="orange" ><v-icon style="font-size:28px">mdi-barcode-scan</v-icon></v-btn>
            </v-card-text>
        </v-card>
        <v-dialog v-model="verbarcode" scrollable transition="dialog-transition">
            <StreamBarcodeReader ref="scanner" v-if="this.verbarcode" @decode="code=> onDecodeBarCode(code)" />
        </v-dialog>

        <template v-if="articulo!=''">
            <p class="font-weight-black" style="color:black">
                {{datosArticulo}}
            </p>
            <Imagen v-if="articulo!=''" :cod="this.articulo.COD_ART" style="inline-size: fit-content;"/>
            <v-divider class="orange" dark></v-divider>
            <v-row>
                <v-col cols="12" class="text-center">
                    <p class="font-weight-black ml-3 mb-0 mt-1" style="font-size:20px">{{articulo.ORD_REC_STR}}</p>
                </v-col>
            </v-row>
            <v-divider class="orange mb-2 mt-2" dark></v-divider>
            <v-row>
                <v-col cols="12" class="text-center">
                    <p class="font-weight-black ml-3 mb-0" style="font-size:16px">{{ean}}</p>
                </v-col>
            </v-row>
            <v-divider class="orange mt-2 mb-5" dark></v-divider>
            <div class="text-center">
                <v-btn outlined small color="orange" :disabled="verificar" @click="clicaceptar()">Aceptar</v-btn>
                <v-btn outlined small color="orange" class="ml-3" @click="clicatras()">Atrás</v-btn>
            </div>
            <div class="mt-5">
                <v-row>
                    <v-col cols="6">
                        <v-simple-table dense>
                            <tbody>
                                <tr>
                                    <td><p class="mb-0" style="font-size:18px; font-weight: bold;">Sector</p></td>
                                    <td>
                                        <input maxlength="2" style="font-size:18px; font-weight: bold; width: 30px;" type="text" v-model="nuevosector" :placeholder="sector" />
                                    </td>
                                </tr>
                                <tr>
                                    <td><p class="mb-0" style="font-size:18px; font-weight: bold;">Módulo</p></td>
                                    <td>
                                        <input maxlength="2" style="font-size:18px; font-weight: bold;width: 30px;" type="text" v-model="nuevomodulo" :placeholder="modulo" />
                                    </td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-col>
                    <v-col cols="6">
                        <v-simple-table dense>
                            <tbody>
                                <tr>
                                    <td><p class="mb-0" style="font-size:18px; font-weight: bold;">Estante</p></td>
                                    <td>
                                        <input maxlength="2" style="font-size:18px; font-weight: bold;width: 30px;" type="text" v-model="nuevoestante" :placeholder="estante" />
                                    </td>
                                </tr>
                                <tr>
                                    <td><p class="mb-0" style="font-size:18px; font-weight: bold;">Posición</p></td>
                                    <td>
                                        <input maxlength="2" style="font-size:18px; font-weight: bold;width: 30px;" type="text" v-model="nuevapos" :placeholder="posicion" />
                                    </td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-col>
                </v-row>
                       
            </div>
        </template>
        <template v-if="loadingArt">
            <v-row  class="fill-height" align-content="center" justify="center">
                <v-col
                class="text-subtitle-1 text-center"
                cols="12"
                >
                Buscando Artículo
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

        <v-alert class="mt-10" text outlined type="error"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
        <v-alert class="mt-10" text outlined type="success"  v-model="alertok" dense transition="scale-transition">
            Ubicación guardada
        </v-alert>

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
import Imagen from '../components/Imagen.vue'
import ApiServer from '../api';
export default {
    name:'Ubicacion',
    components:{Imagen,StreamBarcodeReader },
    data(){
        return{
            verbarcode:false,
            loadingArt:false,
            cargando:false,
            articulo:'',
            datosArticulo:'',
            ean:'',
            alert:false,
            alertok:false,
            mensaje:'',
            sector:'',
            nuevosector:'',
            modulo:'',
            nuevomodulo:'',
            estante:'',
            nuevoestante:'',
            posicion:'',
            nuevapos:''
        }
    },
    methods:{
        async onDecodeBarCode(code){
            this.ean=code
            this.alert=false
            this.verbarcode=false
            this.$refs.scanner.codeReader.stream.getTracks().forEach(function (track) { track.stop() })
            try {
                this.loadingArt=true
                let result = await ApiServer.buscarArticuloporEan(this.ean)
                this.loadingArt=false
                if(result.length>0){
                    this.articulo=result[0]
                    this.datosArticulo=this.articulo.COD_ART+'-'+this.articulo.DESCRIPCION;
                if(this.articulo.MED.length>0){
                    this.datosArticulo=this.datosArticulo+'-'+this.articulo.MED;
                }
                if(this.articulo.MOD.length>0){
                    this.datosArticulo=this.datosArticulo+'-'+this.articulo.MOD;
                }
                if(this.articulo.ORD_REC_STR=='Z'){
                    this.posicion=''
                }else{
                    this.sector=this.articulo.ORD_REC_STR.substring(0,2)
                    this.modulo=this.articulo.ORD_REC_STR.substring(2,4)
                    this.estante=this.articulo.ORD_REC_STR.substring(4,6)
                    this.posicion=this.articulo.ORD_REC_STR.substring(6,8)
                }
                if(this.posicion.length==1){
                    this.posicion='0'+this.posicion
                }
                }else{
                    this.alert=true,
                    this.mensaje='No se encontró articulo con EAN: '+this.ean
                }
            } catch (error) {
                this.loadingArt=false
                console.log(error)
                this.alert=true
                this.mensaje='Se ha producido un error'
            }
            
        },
        clicatras(){
            this.$router.push({name: 'Stock'})
        },
       async clicaceptar(){
            let pos
            if(this.nuevosector!=''){
                pos=this.nuevosector
            }else{
                pos=this.sector
            }
            if(this.nuevomodulo!=''){
                pos+=this.nuevomodulo
            }else{
                pos+=this.modulo
            }
            if(this.nuevoestante!=''){
                pos+=this.nuevoestante
            }else{
                pos+=this.estante
            }
            if(this.nuevapos!=''){
                pos+=this.nuevapos
            }else{
                pos+=this.posicion
            }
            try {
                this.cargando=true
                let result = await ApiServer.putUbicacion({pos:pos, art_id:this.articulo.ART_ID})
                this.cargando=false
                this.alertok=true
                setTimeout(()=>{
                    this.alertok=false
                },5000)
                console.log(result)
                this.articulo=''
                this.verbarcode=true
            } catch (error) {
                this.cargando=false
                console.log(error)
                this.alert=true
                this.mensaje='Se ha producido un error'
            }
        }
    },
    watch:{
        verbarcode(){
            if(this.verbarcode==false){
                this.$refs.scanner.codeReader.stream.getTracks().forEach(function (track) { track.stop() })
            }
        }
    },
    computed:{
        verificar(){
            if(this.nuevosector=='' && this.sector=='')
                return true
            if(this.nuevomodulo=='' && this.modulo=='')
                return true
            if(this.nuevoestante=='' && this.estante=='')
                return true
            if(this.nuevapos=='' && this.posicion=='')
                return true
            return false
        }
    }
}
</script>

<style scoped>

</style>