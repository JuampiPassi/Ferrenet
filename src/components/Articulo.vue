<template>
    <v-container>
        {{notieneimagen}}
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

            <template v-if="notieneimagen">
                <v-img :src="imgnotfound"> </v-img>
            </template>
            <template v-else>
                <!-- <img :src="img">-->
                <v-img contain :src="imagen"></v-img>
            </template>

            <v-card-title>{{descripcion}}</v-card-title>
            <v-divider class="mx-4"></v-divider>
            <v-card-title>Código: {{ean}}</v-card-title>

        </v-card>
    </v-container>
</template>

<script>
import ApiServer from '../api';
export default {
    name: 'Articulo',
    props:{cod: {type: String}},
    data(){
        return{
            imgnotfound:require('@/../image-not-found.png'),
            imagen: require('@/../imgarticulo.png'),
            descripcion: '',
            ean: '',
            loading:false,
            notieneimagen:false,
            articulo:''
        
            
        }
    },
    methods:{
        
    },
    async mounted(){
       
        this.loading=true;
        try {
            let resp = await ApiServer.buscarArticulo(this.cod)
            this.loading=false;
            this.articulo=resp;
            console.log(this.articulo[0])
            if(this.articulo[0].hasOwnProperty('IMAGEN')){

                this.notieneimagen=true;
            }
            this.descripcion=resp[0].DESCRIPCION
            this.ean=resp[0].EAN

            
        } catch (error) {
            this.loading=false;
            console.log(error)
        }   
        
    },
    computed:{
        /*img(){
        try {
                return require('@/../imgarticulo.png')
            } catch (error) {
                return require('@/../image-not-found.png')
            }
        }*/
    },
    watch:{
    }

}
</script>

<style>

</style>