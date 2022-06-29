import axios from 'axios'


export default{
    
    async getUsuarios(){
        return (await axios.get(`./api/usuarios/`)).data;
    },
    async verifUser(pass){
        return (await axios.get(`./api/usuarios/verif?pass=${pass}`)).data;
    },
    async verRol(usuario){
        return(await axios.get(`./api/usuarios/rol/${usuario}`)).data;
    },
    async guardarTexto(info){
        return (await axios.post(`./api/politicas/obsinteligente`,info)).data;
    },
    async verArticulos(id){
        return (await axios.get(`./api/politicas/articulos/${id}`)).data;
    },
    async verFecIngreso(art_id){
        return (await axios.get(`./api/articulos/fecingreso/${art_id}`)).data;
    },
    async buscarArticulo(cod){
        return (await axios.get(`./api/articulos/codigo/${cod}`)).data;
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
    },
    async getCprid(fec_actual, dep_id){
        return (await axios.get(`./api/articulos/cprdet/id?fec_actual=${fec_actual}&dep_id=${dep_id}`)).data
    },
    async putUbicacion(info){
        return (await axios.put(`./api/articulos/editarubicacion`,info)).data
    },
    async postGenerarCpr(fechaHoy){
        let data={fecha: fechaHoy}
        return (await axios.post(`./api/articulos/generarcpr`,data)).data
    },
    async getEmpleadosLegajos(){
        return (await axios.get(`./api/empleados/legajos`)).data
    },
    async getLogisticaCons(){
        return (await axios.get(`./api/logistica/cons`)).data
    },
    async getLogisticaConsDet(id){
        return (await axios.get(`./api/logistica/consdet/${id}`)).data
    },
    async putVisualizando(datos){
        return (await axios.put(`./api/logistica/visualizando`,datos)).data
    },
    async putEditarLogisticaDet(datos){
        return (await axios.put(`./api/logistica/editararticulo`,datos)).data
    },
    async getStockIngreso(art_id){
        return (await axios.get(`./api/articulos/stockingreso/${art_id}`)).data
    }
}