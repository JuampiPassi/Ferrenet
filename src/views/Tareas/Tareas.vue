<template>
    <v-container>
        <template v-if="this.tareas.length>0">
            <!--<template v-for="(item, index) in this.tareas">
                <v-btn :key=index
                    block color="#ef6b01"
                    elevation="2" x-large
                    dark class="mt-5"
                    @click="clicTarea(item.id,item.name,item.description)"
                >{{item.name}}  {{item.fecha}}</v-btn>
            </template>-->

            <v-data-table
                :headers="headers"
                :items="tareas"
                :items-per-page="5"
                class="elevation-1"
                locale="es"
                @click:row="clicTarea"
                :single-expand="true"
                item-key="id"
                :expanded.sync="expanded"
            >
                <template v-slot:item.fecha="{ item }">
                    <v-chip :color="colorFecha(item.fecha)" dark>
                        {{ item.fecha }}
                    </v-chip>
                </template>
                <template v-slot:expanded-item="{headers, item}"> 
                    <v-card style="background-color:#e0f6b6">
                        <v-card-text>
                            {{item.description}}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn outlined color="green" small class="ml-3"  @click="guardar()">Completada</v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-data-table>

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
            headers:[{text:'Tarea',value:'name'},{text:'Vencimiento',value:'fecha'}],
            tipo:'error',
            alert:false,
            mensaje:'',
            tareas:'',
            idTarea:'',
            tareaSelected:'',
            descripcionTarea:'',
            dialogTarea:false,
            alertGuardado:false,
            cargando:false,
            expanded:[]
        }
    },
    methods:{
        clicTarea(fila,event){
            if(event.isExpanded){
               const index = this.expanded.findIndex(i => i=== fila);
               this.expanded.splice(index,1)
            }else{
                this.expanded.push(fila)
            }
            this.idTarea=fila.id
            this.tareaSelected=fila.name
            this.descripcionTarea=fila.description
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
        },
        colorFecha (fecha) {
            let hoy=moment().format('DD-MM-YYYY')
            let dif = moment(hoy,"DD-MM-YYYY").diff(moment(fecha,"DD-MM-YYYY"),'days')
            if (dif>0) return 'red darken-1'
            else if (dif==0) return '#ffaa00'
            else if(dif<0) return 'green darken-1'
            else return 'black'
      },
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