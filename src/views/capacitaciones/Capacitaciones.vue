<template>
    <v-container class="mt-5"> 
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            style="color:white"
            v-if="verProd"
            @click="clicProd()"
        >Producto</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            class="mt-5"
            style="color:white"
            v-if="verProtocolos"
            @click="clicProtocolos()"
        >Protocolos</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            class="mt-5"
            style="color:white"
            v-if="verSeg"
            @click="clicSeg()"
        >Seguridad e Higiene</v-btn>
        <v-btn
            block
            color="#ef6b01"
            elevation="2"
            x-large
            class="mt-5"
            style="color:white"
            v-if="verIns"
            @click="clicIns()"
        >Institucional</v-btn>

        <v-alert class="mt-10" text outlined type="error" v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
        <v-alert class="mt-10"  type="success"  v-model="alertGuardado" dense transition="scale-transition">
            Guardado
        </v-alert>
        <!-------------Dialog Formulario--------------------->
        <v-dialog  v-model="dialogForm" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#ef6b01">
                    <v-btn icon dark @click="dialogForm=false"><v-icon>mdi-arrow-left</v-icon></v-btn>
                    <v-card-title style="color:black">Capacitación {{clicBoton}}</v-card-title>
                </v-toolbar>
                <div style="margin-inline: 15px;" class="mt-5">
                    <v-form ref="form" lazy-validation v-model="formValid">
                        <v-row>
                            <v-col cols="6">
                                 <v-menu
                                    v-model="menuFecha"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="fecha"
                                        label="Fecha"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        color="orange"
                                    ></v-text-field>
                                    </template>
                                    <v-date-picker
                                    v-model="fecha"
                                    @input="menuFecha = false"
                                    color="orange"
                                    ></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field color="orange" v-model="cargaHoraria" label="Carga Horaria" required type="number" :rules="cargaHorariaRules"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field color="orange" v-model="lugar" label="Lugar" required :rules="lugarRules"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field color="orange" v-model="capacitador" label="Capacitador" required :rules="capacitadorRules"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="6">
                                 <v-text-field color="orange" v-model="nombre" label="Nombre de la capacitación" required :rules="nombreRules"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field color="orange" v-model="descripcion" label="Descripción"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-select
                                v-model="participantesSelected"
                                :items="participantes"
                                item-text="nombre"
                                item-value="id"
                                label="Participantes"
                                multiple
                                chips
                                color="orange"
                                deletable-chips
                                item-color="orange"
                                required
                                :rules="participantesRules.select2"
                                ></v-select>
                            </v-col>
                        </v-row>
                         <v-btn color="#ef6b01" class="mr-4 mt-5 mb-5" @click="aceptar">
                            <b>Guardar</b>
                        </v-btn>
                    </v-form>
                </div>
            </v-card>   
        </v-dialog>
    </v-container>
</template>

<script>
import ApiServer from '../../api';
const { v4: uuidv4 } = require('uuid');
export default {
    name: 'Capacitaciones',
    data(){
        return{
            dialogForm:false,
            formValid:true,
            alert:false,
            alertGuardado:false,
            mensaje:'',
            clicBoton:'',
            menuFecha:false,
            fecha:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            cargaHoraria:'',
            cargaHorariaRules: [v => !!v || 'Carga horaria requerida'],
            lugar:"CMS SA",
            lugarRules: [v => !!v || 'Lugar requerido'],
            capacitador:"CMS SA",
            capacitadorRules: [v => !!v || 'Capacitador requerido'],
            nombre:'',
            nombreRules:[v => !!v || 'Nombre requerido'],
            descripcion:'',
            participantes:[],
            participantesSelected:[],
            participantesRules: {
                select: [(v) => !!v || "Seleccione participantes"],
                select2: [(v) =>  v.length>0 || "Seleccione participantes"], 
            },
        }
    },
    methods:{
        clicProd(){
            this.clicBoton="Producto"
            this.dialogForm=true
            //this.$router.push({name: 'Ordylimp'}); 
        },
        clicProtocolos(){
            this.clicBoton="Protocolos"
            this.dialogForm=true
        },
        clicSeg(){
            this.clicBoton="Seguridad e Higiene"
            this.dialogForm=true
        },
        clicIns(){
            this.clicBoton="Institucional"
            this.dialogForm=true
        },
        async aceptar(){
            if(this.$refs.form.validate()){
                let id_capacitacion = uuidv4()
                let datos ={
                    id: id_capacitacion,
                    descripcion:this.descripcion,
                    fecha: this.fecha,
                    lugar: this.lugar,
                    capacitador: this.capacitador,
                    carga_horaria: this.cargaHoraria,
                    nombre:this.clicBoton+" - "+this.nombre,
                    participantes:this.participantesSelected
                }
                this.dialogForm=false
                try {
                    let result = await ApiServer.postCapacitacion(datos);
                    let result1 = await ApiServer.postCapacitacionParticipantes({
                        participantes:this.participantesSelected,
                        id_capacitacion:id_capacitacion})
                    this.cargaHoraria='',this.descripcion='',this.nombre='',this.participantesSelected=[],
                    this.lugar="CMS SA",this.capacitador="CMS SA",this.fecha=(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                    this.$refs.form.resetValidation()
                    this.alertGuardado=true
                    setTimeout(()=>{
                        this.alertGuardado=false
                    },3000)
                } catch (error) {
                    this.dialogForm=false
                    console.log(error)
                    this.alert=true
                    this.mensaje="Se produjo un error"
                }
            }
        }

    },
    computed:{
        verProd(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 9.1))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
         verProtocolos(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 9.2))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
         verSeg(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 9.3))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
         verIns(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 9.4))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
    },
    async mounted(){
        try {
            let resp = await ApiServer.getUsers();
            console.log(resp)
            if(resp.length>0){
                resp.forEach(element => {
                    if(element.first_name!=null&&element.last_name!=null)
                        this.participantes.push({id:element.id ,nombre:element.first_name+" "+element.last_name})
                });
            }
        } catch (error) {
            console.log(error)
            this.alert=true
            this.mensaje='Se ha producido un error'
        }
    }
}
</script>

<style>

</style>