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
    async getLogisticaConsDet(id,usuario){
        return (await axios.get(`./api/logistica/consdet/${id}/${usuario}`)).data
    },
    async putVisualizando(datos){
        return (await axios.put(`./api/logistica/visualizando`,datos)).data
    },
    async putEditarLogisticaDet(datos){
        return (await axios.put(`./api/logistica/editararticulo`,datos)).data
    },
    async getStockIngreso(art_id){
        return (await axios.get(`./api/articulos/stockingreso/${art_id}`)).data
    },
    async getOrdenyLimpieza(usuario){
        return(await axios.get(`./api/auditoria/ordylimp/${usuario}`)).data
    },
    async getOrdenyLimpiezaSectores(id){
        return(await axios.get(`./api/auditoria/ordylimpsectores/${id}`)).data
    },
    async getOrdenyLimpiezaEvaluacion(){
        return(await axios.get(`./api/auditoria/ordylimpevaluacion`)).data
    },
    async putOrdenyLimpieza(datos){
        return(await axios.put(`./api/auditoria/ordylimp`,datos)).data
    },
    async getArmonia(usuario){
        return (await axios.get(`./api/auditoria/armonia/${usuario}`)).data
    },
    async getArmoniaEvaluacion(){
        return(await axios.get(`./api/auditoria/armoniaevaluacion`)).data
    },
    async getArmoniaEvaluar(id){
        return(await axios.get(`./api/auditoria/armoniaevaluar/${id}`)).data
    },
    async putArmonia(datos){
        return (await axios.put(`./api/auditoria/armonia`,datos)).data
    },
    async getTareas(usuario){
        return (await axios.get(`./api/tareas/todas/${usuario}`)).data
    },
    async putTareas(data){
        return (await axios.put(`./api/tareas/editar`,data)).data
    },
    async getUsers(){
        return (await axios.get(`./api/usuarios/todos`)).data
    },
    async postCapacitacion(datos){
        return (await axios.post(`./api/capacitaciones/registro`,datos)).data
    },
    async postCapacitacionParticipantes(datos){
        return (await axios.post(`./api/capacitaciones/participantes`,datos)).data
    },
    async getRemito(cprdet_id){
        return (await axios.get(`./api/comprobantes/remito/${cprdet_id}`)).data
    },
    async getBox(id){
        return (await axios.get(`./api/box/buscar/${id}`)).data
    },
    async deleteBoxRemito(info){
        return (await axios.delete(`./api/box/remitos`,{data: info})).data
    },
    async postBoxRemito(remitos){
        return (await axios.post(`./api/box/remitos`,{remitos:remitos})).data
    },
    async putAsignarBox(datos){
        return (await axios.put(`./api/box/asignar`,datos)).data
    }

}