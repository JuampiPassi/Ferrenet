<template>
     <v-container class="mt-5">
        <v-btn block color="#ef6b01" elevation="2" x-large  dark  @click="clicStock">Stock</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" dark>Pedido</v-btn>
        <v-btn block color="#ef6b01"  elevation="2" x-large class="mt-5" dark>Despacho</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" dark>Ingreso</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" dark>Ventas</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" dark @click="dialogObservador=true">Observador Inteligente</v-btn>

        <v-dialog transition="dialog-bottom-transition" max-width="600" v-model="dialogObservador">
            <v-card>
                <v-toolbar color="orange" dark>Observador Inteligente</v-toolbar>
                <v-card-text>
                    <v-textarea v-model="texto" clearable color="orange">
                    </v-textarea>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn text @click="guardarTexto()">Guardar</v-btn>
                    <v-btn text @click="dialogObservador = false">Close</v-btn>
                </v-card-actions>
            </v-card>
         </v-dialog>

      </v-container>
</template>

<script>
import ApiServer from './../api';
export default {
    name:'Home',
    data(){
        return{
            dialogObservador:false,
            texto:''
        }
    },
    methods:{
        clicStock(){
             this.$router.push({name: 'Stock'});
        },
        async guardarTexto(){
            let info={
                usuario: sessionStorage.getItem("usuario"),
                texto: this.texto
            }
            try {
                let resp = await ApiServer.guardarTexto(info);
                console.log(resp)
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>

<style>

</style>