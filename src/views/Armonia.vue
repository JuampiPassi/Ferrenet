<template>
    <v-container>
        <template v-if="this.personasAuditar.length>0">
            <template v-for="(item, index) in this.personasAuditar">
                <v-btn :key=index
                    block color="#ef6b01"
                    elevation="2" x-large
                    dark class="mt-5"
                    @click="clicPersona(item.id_persona_auditar,item.persona_auditar)"
                >{{item.persona_auditar}}</v-btn>
            </template>
        </template>
        <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
        <v-alert class="mt-10"  type="success"  v-model="alertGuardado" dense transition="scale-transition">
            Guardado
        </v-alert>
        <!-------------Dialog Evaluar--------------------->
        <v-dialog  v-model="dialogEvaluar" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#ef6b01">
                    <v-btn icon dark @click="dialogEvaluar=false"><v-icon>mdi-arrow-left</v-icon></v-btn>
                    <v-card-title style="color:black">Evaluar {{nombrePersona}}</v-card-title>
                </v-toolbar>
                <div style="margin-inline: 15px;" class="mb-5">
                    <template v-for="(item, index) in this.evaluar">
                        <v-btn :key=index
                            block color="#ef6b01"
                            elevation="2" x-large
                            dark class="mt-5"
                            @click="clicEvaluar(item.id,item.evaluar,item.descripcion)"
                        >{{item.evaluar}}</v-btn>
                </template>
                </div>
            </v-card>   
        </v-dialog>
        <!-------------Dialog Evaluación--------------------->
        <v-dialog  v-model="dialogEvaluacion" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#ef6b01">
                       <v-btn icon dark @click="dialogEvaluacion=false"><v-icon>mdi-arrow-left</v-icon></v-btn>
                        <v-toolbar-title style="color:black">{{evaluarSelected}}
                            <div class="subheading" style="font-size:medium">{{nombrePersona}}</div>
                        </v-toolbar-title> 
                        <!--<v-toolbar-title style="color:black; font-size: medium; margin-top: 4px;">{{nombrePersona}}</v-toolbar-title>-->
                </v-toolbar>
                <div style="margin-inline: 15px;" class="mb-5">
                    <template v-for="(item, index) in this.evaluacion">
                        <v-btn :key=index
                            block color="#ef6b01"
                            elevation="2" x-large
                            dark class="mt-5"
                            @click="clicEvaluacion(item.id)"
                        >{{item.evaluacion}}</v-btn>
                    </template>
                    <v-textarea v-if="evaluarDescripcion!=''& evaluarDescripcion!=undefined" v-model="evaluarDescripcion" class="mt-10" style="font-size: large;" outlined readonly color="orange" />
                </div>
            </v-card>   
        </v-dialog>
         <!-------------Dialog Nota--------------------->
        <v-dialog transition="dialog-bottom-transition" fullscreen hide-overlay v-model="dialogNota">
            <v-card>
                <v-toolbar color="#ef6b01">
                    <v-btn icon dark @click="dialogNota=false"><v-icon>mdi-arrow-left</v-icon></v-btn>
                    <v-card-title style="color:black">Nota</v-card-title>
                </v-toolbar>
                <v-card-text class="mt-5">
                    <v-textarea placeholder="" style="font-size: large;" filled full-width outlined v-model="nota" clearable color="orange">
                    </v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-btn outlined color="orange" class="ml-3" text @click="guardar()">Guardar</v-btn>
                </v-card-actions>
            </v-card>
         </v-dialog>
         <v-overlay :value="cargando">
            <v-progress-circular
                indeterminate
                size="70"
                width="7"
            ></v-progress-circular>
        </v-overlay>
    </v-container>
</template>

<script>
import ApiServer from '../api';
export default {
    name: 'Armonia',
    data(){
        return{
            tipo:'error',
            alert:false,
            alertGuardado:false,
            mensaje:'',
            cargando:false,
            personasAuditar:'',
            evaluacion:'',
            evaluar:'',
            nombrePersona:'',
            idPersonaAuditar:'',
            dialogEvaluar:false,
            evaluarDescripcion:'',
            evaluarSelected:'',
            evaluarSelectedId:'',
            evaluacionId:'',
            dialogEvaluacion:false,
            dialogNota:false,
            nota:''
        }
    },
    methods:{
        async inicio(){
            try {
                let result = await ApiServer.getArmonia(sessionStorage.getItem("usuario"))
                this.personasAuditar = result
                if(this.personasAuditar.length>0){
                    this.evaluacion = await ApiServer.getArmoniaEvaluacion()
                    if(this.idPersonaAuditar!=''){
                            this.evaluar = await ApiServer.getArmoniaEvaluar(this.idPersonaAuditar)
                            if(this.evaluar.length>0){
                                this.dialogEvaluar=true
                            }
                        }
                }else{
                    this.alert=true
                    this.mensaje="No se encontraron resultados"
                    this.tipo="warning"
                    setTimeout(()=>{
                    this.$router.push({name: 'Auditoria'});
                    },2000)
                }
            } catch (error) {
                console.log(error)
                this.alert=true
                this.mensaje="Se ha producido un error"
                this.tipo="error"
            }
        },
        async clicPersona(id,nombre){
            this.nombrePersona=nombre  
            this.idPersonaAuditar=id
            try {
                this.evaluar = await ApiServer.getArmoniaEvaluar(id)
                if(this.evaluar.length>0){
                    this.dialogEvaluar=true
                }
            } catch (error) {
                console.log(error)
                this.alert=true
                this.mensaje="Se ha producido un error"
                this.tipo="error"
            }
        },
        clicEvaluar(id,nombre,descripcion){
            this.evaluarSelected=nombre
            this.evaluarSelectedId=id
            this.evaluarDescripcion=descripcion
            this.dialogEvaluar=false
            this.dialogEvaluacion=true
        },
        clicEvaluacion(id){
            this.dialogEvaluacion=false
            this.evaluacionId=id
            this.dialogNota=true
        },
        async guardar(){
            this.dialogNota=false
            this.cargando=true
            this.alert=false
            try {
                let datos={
                    id_persona:this.idPersonaAuditar,
                    evaluar_id:this.evaluarSelectedId,
                    evaluacion_id:this.evaluacionId,
                    nota:this.nota
                }
                let result = await ApiServer.putArmonia(datos)
                this.cargando=false
                this.inicio()
                this.alertGuardado=true
                setTimeout(()=>{
                    this.alertGuardado=false
                },3000)
            } catch (error) {
                this.cargando=false
                this.alert=true
                this.mensaje="Se produjo un error al guardar"
                this.tipo="error"
            }
        }
    },
    mounted(){
        this.inicio()
    }
}
</script>

<style scoped>

</style>