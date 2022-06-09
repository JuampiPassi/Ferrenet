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
    async verMotivos(){
        return (await axios.get(`./api/politicas/motivos`)).data;
    },
    async artnoajustado(info){
        return (await axios.post(`./api/politicas/noescaneado`,info)).data; 
    },
    async eliminarArticulo(info){
        return (await axios.delete(`./api/politicas/eliminararticulo`,{data: info})).data;
    },
    async aclajeajustes(info){
        return (await axios.post(`./api/politicas/ajuste`,info)).data;
    },
    async ajustarArticulo(info){
        return (await axios.post(`./api/articulos/ajustarstock`,info)).data;
    },
    async editarStock(info){
        return (await axios.put(`./api/articulos/editarstock`, info)).data
    },
    async editarArticulo(art_id){
        return (await axios.put(`./api/articulos/editararticulo/${art_id}`)).data
    }
}