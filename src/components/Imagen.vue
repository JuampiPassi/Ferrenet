<template>
    <v-container>
        <v-img contain :src="`http://localhost:8080/api/articulos/imagen/${this.cod}`" 
        max-width="160"
        max-height="160"
        />
        
        
    </v-container>
</template>

<script>
export default {
    name: 'Imagen',
    props:{cod: {type: String}},
    data(){
        return{
            
        }
    },
    methods:{   
   
    
    },
    computed:{  
    },
    watch:{
    }

}
</script>

<style>

</style>