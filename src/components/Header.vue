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

            <v-list-item link @click="IrStock" v-if="verStock">
                <v-list-item-action>
                <font-awesome-icon style="color:#ef6b01" icon="cubes" />
                </v-list-item-action>

                <v-list-item-content>
                <v-list-item-title style="color: #424242">Stock</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link @click="IrPedidos" v-if="verPedidos">
                <v-list-item-action>
                <font-awesome-icon style="color:#ef6b01" icon="boxes-packing" />
                </v-list-item-action>

                <v-list-item-content>
                <v-list-item-title style="color: #424242">Pedidos</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link @click="IrDespacho" v-if="verDespacho">
                <v-list-item-action>
                <font-awesome-icon style="color:#ef6b01" icon="dolly" />
                </v-list-item-action>

                <v-list-item-content>
                <v-list-item-title style="color: #424242">Despacho</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link @click="IrIngreso" v-if="verIngreso">
                <v-list-item-action>
                <v-icon color="#ef6b01" >mdi-archive-outline</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                <v-list-item-title style="color: #424242">Ingreso</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link @click="IrVentas" v-if="verVentas">
                <v-list-item-action>
                <v-icon color="#ef6b01" >mdi-cart-check</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                <v-list-item-title style="color: #424242">Ventas</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link @click="IrTareas" v-if="verTareas">
                <v-list-item-action>
                <font-awesome-icon style="color: #ef6b01" icon="list-check" />
                </v-list-item-action>

                <v-list-item-content>
                <v-list-item-title style="color: #424242">Tareas</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item link @click="IrAuditoria" v-if="verAuditoria">
                <v-list-item-action>
                <font-awesome-icon style="color: #ef6b01" icon="person-chalkboard" />
                </v-list-item-action>

                <v-list-item-content>
                <v-list-item-title style="color: #424242">Auditoría</v-list-item-title>
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
            if (this.$route.path !== '/Stock') 
            this.$router.push({name: 'Stock'});
        },
        IrPedidos(){
            if (this.$route.path !== '/Pedidos') 
            this.$router.push({name: 'Pedidos'});
        },
        IrDespacho(){
        },
        IrIngreso(){},
        IrVentas(){},
        IrTareas(){
            if (this.$route.path !== '/Tareas') 
            this.$router.push({name: 'Tareas'});
        },
        IrAuditoria(){
            if (this.$route.path !== '/Auditoria') 
            this.$router.push({name: 'Auditoria'});
        },
        IrEscaner(){
          if (this.$route.path !== '/Escaner') 
            this.$router.push({name: 'Escaner'});  
        },
        cerrarSesion(){
            sessionStorage.clear();
            window.location.reload();
        }
    },
    mounted(){
        this.usuario = sessionStorage.getItem("usuario");
    },
     computed:{
        verStock(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 1))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verPedidos(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 2))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verDespacho(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 3))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verIngreso(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 4))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verVentas(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 5))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verTareas(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 7))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
        verAuditoria(){
            let modulo = JSON.parse(sessionStorage.getItem('modulos'))
            if(sessionStorage.getItem('rol')==1)
                return true;
            if(modulo!=''&&modulo!=null){
                if((modulo.find(x => x.id_modulo == 8))!=undefined){
                    return true
                }else{
                    return false
                }
            }
            return false;
        },
     }

}
</script>

<style>

</style>