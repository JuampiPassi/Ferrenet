<template>
    <v-container>
        <template v-if="this.tareas.length>0">
            <template v-for="(item, index) in this.tareas">
                <v-btn :key=index
                    block color="#ef6b01"
                    elevation="2" x-large
                    dark class="mt-5"
                    @click="clicTarea(item.id,item.name,item.description)"
                >{{item.name}}  {{item.fecha}}</v-btn>
            </template>
        </template>
         <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
        <v-alert class="mt-10"  type="success"  v-model="alertGuardado" dense transition="scale-transition">
            Guardado
        </v-alert>
        <v-overlay :value="cargando">
            <v-progress-circular
                indeterminate
                size="70"
                width="7"
            ></v-progress-circular>
        </v-overlay>
        <!-------------Dialog Ver Tarea--------------------->
        <v-dialog  v-model="dialogTarea" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#ef6b01">
                    <v-btn icon dark @click="dialogTarea=false"><v-icon>mdi-arrow-left</v-icon></v-btn>
                    <v-card-title style="color:black">{{tareaSelected}}</v-card-title>
                </v-toolbar>
                <div style="margin-inline: 15px;" class="mb-5 mt-5">
                    <h3>Descripción</h3>
                    <v-textarea v-if="descripcionTarea!=''" v-model="descripcionTarea" filled full-width class="mt-5" style="font-size: large;" outlined readonly color="orange" />
                </div>
                <v-card-actions>
                    <v-btn outlined color="orange" class="ml-3" text @click="guardar()">Completada</v-btn>
                </v-card-actions>
            </v-card>   
        </v-dialog>
    </v-container>
</template>

<script>
import ApiServer from '../../api';
import moment from 'moment';
export default {
    name: 'Tareas',
    data(){
        return{
            tipo:'error',
            alert:false,
            mensaje:'',
            tareas:'',
            idTarea:'',
            tareaSelected:'',
            descripcionTarea:'',
            dialogTarea:false,
            alertGuardado:false,
            cargando:false
        }
    },
    methods:{
        clicTarea(id,tarea,desc){
            this.idTarea=id
            this.tareaSelected=tarea
            this.descripcionTarea=desc
            this.dialogTarea=true
        },
        async guardar(){
            var fecha = moment().add(3,'hours').format('YYYY-MM-DD hh:mm:ss')
            let datos={
                id:this.idTarea,
                fecha: fecha
            }
            try {
                this.dialogTarea=false
                this.cargando=true
                let resp = await ApiServer.putTareas(datos)
                this.cargando=false
                this.Inicio()
                this.alertGuardado=true
                setTimeout(()=>{
                    this.alertGuardado=false
                },2000)
                console.log(resp)
            } catch (error) {
                this.cargando=false
                console.log(error)
                this.alert=true
                this.mensaje="Se ha producido un error"
                this.tipo="error"
            }
        },
        async Inicio(){
            try {
                this.tareas = await ApiServer.getTareas(sessionStorage.getItem("usuario"))
                if(this.tareas.length>0){
                    this.tareas.forEach(element => {
                        element.fecha = moment(element.fecha).format('DD-MM-YYYY')
                    });
                }else{
                    this.alert=true
                    this.mensaje="No se encontraron resultados"
                    this.tipo="warning"
                    setTimeout(()=>{
                        this.$router.push({name: 'Home'});
                    },2000)
                }
            } catch (error) {
                console.log(error)
                this.alert=true
                this.mensaje="Se ha producido un error"
                this.tipo="error"
            }
        }  
    },
    async mounted(){
        this.Inicio()
    },
    computed:{
    }
}
</script>

<style>

</style>