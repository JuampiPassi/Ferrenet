<template>
   <v-container fluid>
      <v-card rounded max-width="390"  class="mx-auto my-15">
                <v-toolbar flat color="#ef6b01" dark>
                    <v-spacer />
                        <v-toolbar-title class="text-center">
                            <v-img
                                class="mx-2"
                                src="../assets/ferrenet.png"
                                max-height="40"
                                max-width="200px"
                                contain
                            ></v-img>
                        </v-toolbar-title>
                    <v-spacer />
                </v-toolbar>
                <v-row align="center" class="mx-0">
                    <v-col cols="12" align="center">
                        <v-card-title style="flex-direction: column;" color="#373435">Ingresar</v-card-title>
                    </v-col>
                </v-row>
                <v-card-text>
                    <v-form ref="form1" align="center" v-on:submit.prevent>
                        <v-row align="center" class="mx-0">
                            <v-col cols="12" align="center">
                                <v-text-field
                                :loading='loading'
                                prepend-icon="person"
                                :append-icon="verContraseña ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="verContraseña = !verContraseña"
                                :type="verContraseña ? 'text' : 'password'"
                                v-model="usuario"
                                label="Contraseña"
                                outlined
                                color="#ef6b01"
                                @keyup.enter="login"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                    </v-form>

                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#373435" text @click="login">Ingresar</v-btn>
                </v-card-actions>

            </v-card>
            <v-alert  :type="tipo"  v-model="alert" dense dismissible transition="scale-transition">
                {{mensaje}}
            </v-alert>
    </v-container>
</template>

<script>
import ApiServer from './../api';
const crypto = require('crypto');
export default {
    name:'Login',
    data(){
        return{
            loading: false,
            usuario: '',
            mensaje:'',
            tipo:'success',
            alert:false,
            verContraseña:false
            
        }
    },
    methods:{
        async login(){
            if(this.usuario!=''){
                this.loading=true;
                let pass = (crypto.createHash('md5').update(this.usuario).digest("hex")).toUpperCase();
                try {
                    let resp = await ApiServer.verifUser(pass);
                    if(resp!=''){
                        try {
                            let rol = await ApiServer.verRol(resp[0].USUARIO) ;
                            this.loading=false;
                            console.log(resp[0])
                            sessionStorage.setItem('logged', true);
                            sessionStorage.setItem('usuario', resp[0].USUARIO);
                            sessionStorage.setItem('usu_id', resp[0].USU_ID);

                            if(rol.id_rol==1){
                                sessionStorage.setItem('rol', 1);
                            }else{
                                sessionStorage.setItem('rol', rol.id_rol);
                                sessionStorage.setItem('modulos',JSON.stringify(rol.modulos))
                            }
                            this.$router.push({ name: 'Home'});
                            window.location.reload();
                        } catch (error) {
                            console.log(error)
                            this.loading=false;
                            this.mensaje='No posee permisos de acceso'
                            this.tipo='error'
                            this.alert=true
                            setTimeout(()=>{
                                this.alert=false
                            },5000)
                        }
                    }else{
                        this.loading=false;
                        this.mensaje='Contraseña Incorrecta'
                        this.tipo='error'
                        this.alert=true
                        setTimeout(()=>{
                            this.alert=false
                        },5000)
                    }
                } catch (error) {
                    this.loading=false;
                    this.mensaje='Se ha producido un error'
                    this.tipo='error'
                    this.alert=true
                    console.log(error)
                }
            }else{
                this.loading=false;
                this.mensaje='Ingrese Usuario'
                this.tipo='warning'
                this.alert=true
                setTimeout(()=>{
                    this.alert=false
                },5000)
            }
        },
        async inicio(){
            try {
                let resp = await ApiServer.getUsuarios();
                console.log(resp)
            } catch (error) {
                this.mensaje='Se ha producido un error al conectar'
                this.tipo='error'
                this.alert=true
                console.log(error)
            }
        }
    },
    async mounted(){
        //await this.inicio();
    }

}
</script>

<style>

</style>