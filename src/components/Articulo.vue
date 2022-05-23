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

            

            <v-card-title class="titulo text-center">{{descripcion}}</v-card-title>
            <v-divider class="mx-4"></v-divider>
            <v-card-text>
                <h2 class="titulo text-center"><b>Mod: </b>{{mod}}</h2>
                <v-divider class="mx-4 mt-3 mb-3"></v-divider>
                <h2 class="titulo text-center"><b>Med: </b>{{medidas}}</h2>
                <v-divider class="mx-4 mt-3 mb-3"></v-divider>
                <h2 class="titulo text-center"><b>Empaque: </b>{{empaque}}</h2>
                <v-divider class="mx-4 mt-3 mb-3"></v-divider>
                <h2 class="titulo text-center"><b>EAN: </b>{{ean}}</h2>
                <v-divider class="mx-4 mt-3 mb-3"></v-divider>
                <h2 class="titulo text-center"><b>Stock: </b>{{stock}}</h2>
            </v-card-text>
            

        </v-card>
    </v-container>
</template>

<script>
import ApiServer from '../api';
import Imagen from '../components/Imagen.vue'
export default {
    name: 'Articulo',
    components:{ Imagen },
    props:{cod: {type: String}},
    data(){
        return{
            descripcion: '',
            ean: '',
            loading:false,
            articulo:'',
            medidas:'',
            empaque: '',
            mod:'',
            stock: ''
              
        }
    },
    methods:{
        
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
.titulo{
    word-break: normal;
}

</style>