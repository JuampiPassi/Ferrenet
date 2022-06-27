
const firebirdMetodos = require('../lib/firebirdMetodos');
const logger = require('../logger');


const getEmpleadosLegajos = async () => {
    try {
    
        let consulta = `select ENT.rz, EM.legajo from empleados EM,  Entidades ENT where EM.ent_id=ENT.ent_id`;
        let resp = await firebirdMetodos.getConsultaPaljet(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo getEmpleadosLegajos');
        logger.error(error);
        return error;
    }
}

const funcionesexportadas = {
    getEmpleadosLegajos,
}
module.exports = funcionesexportadas;