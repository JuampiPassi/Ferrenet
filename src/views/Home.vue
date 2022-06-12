<template>
     <v-container class="mt-5">
        <v-btn block color="#ef6b01" elevation="2" x-large  dark  @click="clicStock">Stock</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" dark>Pedido</v-btn>
        <v-btn block color="#ef6b01"  elevation="2" x-large class="mt-5" dark>Despacho</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" dark>Ingreso</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" dark>Ventas</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" dark @click="dialogObservador=true; texto=''">Observador Inteligente</v-btn>


        <v-alert class="mt-10" text border="left" colored-border elevation="24" type="success"  v-model="alert" dense dismissible transition="scale-transition">
                Guardado
        </v-alert>

        <v-dialog transition="dialog-bottom-transition" max-width="600" v-model="dialogObservador">
            <v-card>
                <v-toolbar color="orange" dark>Observador Inteligente</v-toolbar>
                <v-card-text>
                    <v-textarea :loading="loadingText" v-model="texto" clearable color="orange">
                    </v-textarea>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn text @click="guardarTexto()" color="orange">Guardar</v-btn>
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
            texto:'',
            loadingText:false,
            alert:false
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
                this.loadingText=true
                let resp = await ApiServer.guardarTexto(info);
                this.loadingText=false
                this.dialogObservador = false
                this.alert=true
                setTimeout(()=>{
                            this.alert=false
                        },3000)
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