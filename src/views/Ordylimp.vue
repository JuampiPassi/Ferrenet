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
        <!-------------Dialog Sectores--------------------->
        <v-dialog  v-model="dialogSectores" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#ef6b01">
                    <v-btn icon dark @click="dialogSectores=false"><v-icon>mdi-arrow-left</v-icon></v-btn>
                    <v-card-title style="color:black">Sector/es {{nombrePersona}}</v-card-title>
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
        <v-dialog  v-model="dialogEvaluacion" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#ef6b01">
                    <v-btn icon dark @click="dialogEvaluacion=false"><v-icon>mdi-arrow-left</v-icon></v-btn>
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
            nombrePersona:'',
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
        async clicPersona(id,nombre){
            this.nombrePersona=nombre
            try {
                this.idPersona=id
                this.sectores = await ApiServer.getOrdenyLimpiezaSectores(id)
                if(this.sectores.length>0){
                    this.dialogSectores=true
                }
            } catch (error) {
                this.alert=true
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
                this.loading=false 
            }
        },
        async inicio(){
            try {
                let result = await ApiServer.getOrdenyLimpieza(sessionStorage.getItem("usuario"))
                this.personasAuditar= result
                if(this.personasAuditar.length>0){
                    try {
                        this.evaluacion = await ApiServer.getOrdenyLimpiezaEvaluacion()
                    } catch (error) {
                            console.log(error)
                            this.alert=true
                            this.mensaje="Se ha producido un error"
                            this.tipo="error"
                            this.loading=false
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
                this.loading=false
            }
        }

    },
    mounted(){
        this.inicio()
    }
}
</script>

<style>

</style>