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
                                v-model="usuario"
                                label="Usuario"
                                type="text"
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
export default {
    name:'Login',
    data(){
        return{
            loading: false,
            usuario: '',
            mensaje:'',
            tipo:'success',
            alert:false
            
        }
    },
    methods:{
        login(){
            if(this.usuario!=''){
                sessionStorage.setItem('logged', true);
                sessionStorage.setItem('usuario', this.usuario);
                this.$router.push({ name: 'Home'});
                window.location.reload();
            }else{
                this.mensaje='Ingrese Usuario'
                this.tipo='warning'
                this.alert=true
                setTimeout(()=>{
                    this.alert=false
                },5000)
            }
        }
    }

}
</script>

<style>

</style>