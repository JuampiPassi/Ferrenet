<template>
    <v-container>
        <template v-if="this.personasAuditar.length>0">
            <template v-for="(item, index) in this.personasAuditar">
                <v-btn :key=index
                    block color="#ef6b01"
                    elevation="2" x-large
                    dark class="mt-5"
                    @click="clicPersona(item.id_persona_auditar)"
                >{{item.persona_auditar}}</v-btn>
            </template>
        </template>
        <v-alert class="mt-10"  :type="tipo"  v-model="alert" dense transition="scale-transition">
            {{mensaje}}
        </v-alert>
        <v-alert class="mt-10"  type="success"  v-model="alertGuardado" dense transition="scale-transition">
            Guardado
        </v-alert>
        <!-------------Dialog Sectores--------------------->
        <v-dialog  v-model="dialogSectores" max-width="500px" scrollable transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#ef6b01">
                    <v-card-title style="color:black">Sector</v-card-title>
                </v-toolbar>
                <div style="margin-inline: 15px;" class="mb-5">
                    <template v-for="(item, index) in this.sectores">
                        <v-btn :key=index
                            block color="#ef6b01"
                            elevation="2" x-large
                            dark class="mt-5"
                            @click="clicSector(item.id)"
                        >{{item.sector}}</v-btn>
                </template>
                </div>
            </v-card>   
        </v-dialog>
        <!-------------Dialog Evaluación--------------------->
        <v-dialog  v-model="dialogEvaluacion" max-width="500px" scrollable transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#ef6b01">
                    <v-card-title style="color:black">Evaluación</v-card-title>
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
                </div>
            </v-card>   
        </v-dialog>
        <!-------------Dialog Nota--------------------->
        <v-dialog transition="dialog-bottom-transition" max-width="600" v-model="dialogNota">
            <v-card>
                <v-toolbar color="#ef6b01">
                    <v-card-title style="color:black">Nota</v-card-title>
                </v-toolbar>
                <v-card-text>
                    <v-textarea  v-model="nota" clearable color="orange">
                    </v-textarea>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn text @click="guardar()" color="orange">Guardar</v-btn>
                    <v-btn text @click="dialogNota = false">Cancelar</v-btn>
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
    name:'Ordylimp',
    data(){
        return{
            tipo:'error',
            alert:false,
            alertGuardado:false,
            mensaje:'',
            cargando:false,
            personasAuditar:'',
            idPersona:'',
            sectores:'',
            idSector:'',
            dialogSectores:false,
            evaluacion:'',
            idEvaluacion:'',
            dialogEvaluacion:false,
            dialogNota:false,
            nota:''
        }
    },
    methods:{
        async clicPersona(id){
            try {
                this.idPersona=id
                this.sectores = await ApiServer.getOrdenyLimpiezaSectores(id)
                if(this.sectores.length>0){
                    this.dialogSectores=true
                }
            } catch (error) {
                this.mensaje="Se produjo un error al cargar sectores"
                this.tipo="error"
                this.loading=false
            }       
        },
        clicSector(id){
            this.idSector=id
            this.dialogSectores=false
            this.dialogEvaluacion=true
        },
        clicEvaluacion(id){
            this.idEvaluacion=id
            this.dialogEvaluacion=false
            this.nota=''
            this.dialogNota=true
        },
        async guardar(){
            this.dialogNota=false
            this.cargando=true
            try {
                let datos={
                    persona_id:this.idPersona,
                    eval_id:this.idEvaluacion,
                    nota:this.nota,
                    sector_id:this.idSector
                }
                let result = await ApiServer.putOrdenyLimpieza(datos)
                this.cargando=false
                this.alertGuardado=true
                setTimeout(()=>{
                    this.alertGuardado=false
                },3000)
            } catch (error) {
                 this.cargando=false
                this.mensaje="Se produjo un error al guardar"
                this.tipo="error"
                this.loading=false 
            }
        }

    },
    async mounted(){
        try {
           let result = await ApiServer.getOrdenyLimpieza()
           this.personasAuditar= result
           try {
            this.evaluacion = await ApiServer.getOrdenyLimpiezaEvaluacion()
           } catch (error) {
                console.log(error)
                this.mensaje="Se ha producido un error"
                this.tipo="error"
                this.loading=false
           }
        } catch (error) {
            console.log(error)
            this.mensaje="Se ha producido un error"
            this.tipo="error"
            this.loading=false
        }
    }
}
</script>

<style>

</style>