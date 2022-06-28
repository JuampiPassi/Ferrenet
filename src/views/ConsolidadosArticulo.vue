<template>
    <v-container>
        <template v-if="articulos!=''">
            <p class="font-weight-black" style="color:black">
                {{datosArt}}
            </p>
            <Imagen :cod="articulos[0].cod_art" style="inline-size: fit-content;"/>
            <v-divider class="orange" dark></v-divider>
            <v-row class="mt-0">
                <v-col cols="12" class="text-center" style="padding:5px">
                    <p class="font-weight-black" style="font-size:20px">{{articulos[0].orden_str}}</p>
                </v-col>
            </v-row>
            <v-divider class="orange mb-5" dark></v-divider>
            <!--<v-row>
                <v-col cols="11" class="text-center">
                    <p class="font-weight-black ml-3 mb-0" style="font-size:16px">{{ean}}</p>
                    <p v-if="this.veriffail" class="ml-3 mb-0" style="font-size:20px;color:red">{{codeerror}}</p>
                </v-col>
                <v-col cols="1">
                    <v-icon v-if="this.verifok" class="float-right" style="margin-right: 15px" color="green">mdi-check-circle</v-icon> 
                    <v-icon v-if="this.veriffail" class="float-right" style="margin-right: 15px" color="red">mdi-close-circle</v-icon>   
                </v-col>
            </v-row>
            <v-divider class="orange mt-5 mb-5" dark></v-divider>-->
            <div class="text-center">
                <v-btn outlined small color="orange" class="ml-3">Pasar</v-btn>
                <v-btn outlined small color="orange" class="ml-3">Aceptar</v-btn>
            </div>
            <div class="mt-5">
                <v-simple-table dense>
                    <tbody>
                        <tr>
                            <td><p class="mb-0" style="font-size:20px; font-weight: bold;">Cantidad</p></td>
                            <td>
                                <input style="font-size:20px; font-weight: bold; width:100%" type="number" v-model="nuevacant" :placeholder="cantidad"/>
                            </td>
                        </tr>
                        <tr>
                            <td>Stock</td>
                            <td>{{articulos[0].stock}}</td>
                        </tr>
                        <tr>
                            <td>Empaque</td>
                            <td>{{articulos[0].empaque}}</td>
                        </tr>
                        <tr v-if="articulos[0].fec_ctrol || articulos[0].fec_ult_ingr">
                            <template v-if="articulos[0].fec_ctrol">
                                <td style="width: 10%;">Fec ctrl</td>
                                
                                <td style="width: 90px;">{{this.articulos[0].fec_ctrol}}</td>
                            </template>
                            <template v-if="articulos[0].fec_ult_ingr">
                                <td style="width: 83px;">Fec ingr</td>
                                <td >{{ articulos[0].fec_ult_ingr}}</td>
                            </template>
                        </tr>
                    </tbody>
                </v-simple-table>
            </div>
        </template>
        
        <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
    </v-container>
</template>

<script>
import ApiServer from '../api';
import Imagen from '../components/Imagen.vue'
import moment from 'moment';
export default {
    name:'ConsolidadosArticulo',
    components:{ Imagen},
    data(){
        return{
            id:this.$route.params.id,
            alert:false,
            tipo:'error',
            mensaje:'',
            articulos:'',
            datosArt:'',
            cantidad:'',
            nuevacant:''
        }
    },
    async mounted(){
        if(this.$route.params.id==undefined){
            this.$router.push({name: 'Consolidados'}); 
        }else{
            try {
                let resp = await ApiServer.getLogisticaConsDet(this.$route.params.id)
                this.articulos=resp
                if(this.articulos.length==0){
                    this.alert=true,
                    this.tipo='error',
                    this.mensaje="No se encontraron artículos"
                }else{
                    this.datosArt=this.articulos[0].cod_art+"-"+this.articulos[0].descripcion
                    if(this.articulos[0].med!=''){
                        this.datosArt+="-"+this.articulos[0].med
                    }
                    if(this.articulos[0].MOD1!=''){
                        this.datosArt+="-"+this.articulos[0].MOD1
                    }
                    if(this.articulos[0].empaque!=0){
                        this.cantidad=this.articulos[0].cant_no_proc/this.articulos[0].empaque
                    }else{
                        this.cantidad=this.articulos[0].cant_no_proc
                    }
                    if(this.articulos[0].fec_ctrol){
                      this.articulos[0].fec_ctrol = moment(this.articulos[0].fec_ctrol).format('DD-MM-YY');
                    }
                    if(this.articulos[0].fec_ult_ingr){
                      this.articulos[0].fec_ult_ingr = moment(this.articulos[0].fec_ult_ingr).format('DD-MM-YY');  
                    }
                }
                console.log(resp)
            } catch (error) {
                console.log(error)
                this.alert=true,
                this.tipo='error',
                this.mensaje="Se ha producido un error"
            }
        }
    }
}
</script>

<style>

</style>