<template>
     <v-container class="mt-5">
        <v-btn block color="#ef6b01" elevation="2" x-large v-if="verStock" @click="clicStock" style="color:white">Stock</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" style="color:white" v-if="verPedido" @click="clicPedidos">Pedidos</v-btn>
        <v-btn block color="#ef6b01"  elevation="2" x-large class="mt-5" style="color:white" v-if="verDespacho">Despacho</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" style="color:white" v-if="verIngreso">Ingreso</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" style="color:white" v-if="verVentas">Ventas</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" @click="dialogObservador=true; texto=''" style="color:white" v-if="verObsInt">Observador Inteligente</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" style="color:white" v-if="verTareas" @click="clicTareas">Tareas</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" style="color:white" v-if="verAudit" @click="clicAuditoria">Auditoría</v-btn>
        <v-btn block color="#ef6b01" elevation="2" x-large class="mt-5" style="color:white" v-if="verCapacitaciones" @click="clicCapacitaciones">Capacitaciones</v-btn>

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
                    <v-btn text @click="dialogObservador = false">Cerrar</v-btn>
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
            alert:false,
            modulos:'',
        }
    },
    methods:{
        clicStock(){
            this.$router.push({name: 'Stock'});
        },
        clicAuditoria(){
            this.$router.push({name: 'Auditoria'});
        },
        clicPedidos(){
            this.$router.push({name: 'Pedidos'});
        },
        clicTareas(){
            this.$router.push({name: 'Tareas'});
        },
        clicCapacitaciones(){
            this.$router.push({name: 'Capacitaciones'});
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
    },
    mounted(){
    },
    computed:{
        verStock(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 1))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verPedido(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 2))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verDespacho(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 3))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verIngreso(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 4))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verVentas(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 5))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verObsInt(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 6))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verTareas(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 7))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verAudit(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 8))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verCapacitaciones(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 9))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        }
    }
}
</script>

<style>

</style>