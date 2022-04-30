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

               <v-img 
               src="../assets/logo.jpg"
               max-height="80px"
               max-width="240px"
               contain
               ></v-img>
 
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
        }
    },
    methods: {
        IrPrincipal(){
            if (this.$route.path !== '/') 
            this.$router.push({name: 'Home'});
        },
    }

}
</script>

<style>

</style>