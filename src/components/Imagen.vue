<template>
    <v-container>
        <v-img contain :src="source">

        </v-img>
    </v-container>
</template>

<script>
import ApiServer from '../api';
export default {
    name: 'Imagen',
    props:{cod: {type: String}},
    data(){
        return{
            source: ''
        }
    },
    methods:{   
    },
    async mounted(){
         try {
            let resp = await ApiServer.buscarImagen(this.cod)
            if(resp[0].ISNULL==1){
                this.source=require('@/../image-not-found.png')
            }else{
                this.source=require('@/../imgarticulo.png')
            }
            console.log('img: ',resp[0])    
        } catch (error) {
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

</style>