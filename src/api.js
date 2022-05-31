import axios from 'axios'


export default{
    
    async getUsuarios(){
        return (await axios.get(`./api/usuarios/`)).data;
    },
    async verifUser(pass){
        return (await axios.get(`./api/usuarios/verif?pass=${pass}`)).data;
    },
    async verArticulos(id){
        return (await axios.get(`./api/politicas/articulos/${id}`)).data;
    },
    async buscarArticulo(cod){
        return (await axios.get(`./api/articulos/${cod}`)).data;
    },
    async buscarImagen(cod){
        return(await axios.get(`./api/articulos/imagen/${cod}`)).data;
    },
    async buscarArticuloporEan(ean){
        return (await axios.get(`./api/articulos/ean/${ean}`)).data;
    },
    async verPoliticas(){
        return (await axios.get(`./api/politicas/`)).data;
    },
    async eliminarArticulo(cod){
        return (await axios.get(`./api/politicas/eliminararticulo/${cod}`)).data;
    },
}