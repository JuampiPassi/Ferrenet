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
    async verPoliticas(){
        return (await axios.get(`./api/politicas/`)).data;
    },
}