<template>
    <div>
        <v-navigation-drawer
            v-model="drawer"
            :clipped="$vuetify.breakpoint.lgAndUp"
            fixed
            app
        >

        <template v-slot:prepend>
            <v-list-item class="px-1">
                <v-list-item-avatar size="50">
                    <v-img 
                    src="../assets/avatar.png"
                    max-height="80px"
                    max-width="240px"
                    contain
                    ></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>{{usuario}}</v-list-item-title>
                    <v-list-item-subtitle link @click="cerrarSesion">
                        <a style="font-size: 15px;">Salir</a>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list dense>

            <template>
            <v-list-item link @click="IrPrincipal">
                <v-list-item-action>
                <v-icon color="#ef6b01" >mdi-home</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                <v-list-item-title style="color: #424242">Home</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link @click="IrStock">
                <v-list-item-action>
                <v-icon color="#ef6b01" >mdi-archive-outline</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                <v-list-item-title style="color: #424242">Stock</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link @click="IrEscaner">
                <v-list-item-action>
                <v-icon color="#ef6b01" >mdi-barcode</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                <v-list-item-title style="color: #424242">Escaner</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            </template>
        </v-list>

        </v-navigation-drawer>

        <v-app-bar
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        color="#ef6b01"
        dark
        app
        fixed
        >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-img
            class="mx-2"
            src="../assets/ferrenet.png"
            max-height="40"
            max-width="200px"
            contain
        ></v-img>
        <v-spacer></v-spacer>


        </v-app-bar>
    </div>
</template>

<script>
export default {
    data(){
        return{
            drawer: null,
            usuario: '',
        }
    },
    methods: {
        IrPrincipal(){
            if (this.$route.path !== '/') 
            this.$router.push({name: 'Home'});
        },
        IrStock(){
            if (this.$route.path !== 'Stock') 
            this.$router.push({name: 'Stock'});
        },
        IrEscaner(){
          if (this.$route.path !== 'Escaner') 
            this.$router.push({name: 'Escaner'});  
        },
        cerrarSesion(){
            sessionStorage.clear();
            window.location.reload();
        }
    },
    mounted(){
        this.usuario = sessionStorage.getItem("usuario");
    }

}
</script>

<style>

</style>