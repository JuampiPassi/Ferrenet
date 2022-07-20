const config = require('../config/config.json');
const firebirdMetodos = require('../lib/firebirdMetodos');
const logger = require('../logger');
const axios = require('axios')


const getRemito = async (cprdet_id) => {
    try {
    
        let consulta = `select c.rz,c.nro,c.nro_cpr,c.cpr_id from cpr c, cprdet cp where cp.cpr_id=c.cpr_id AND cp.cprdet_id=${cprdet_id}`;
        let resp = await firebirdMetodos.getConsultaPaljet(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo getRemito');
        logger.error(error);
        return error;
    }
}

const funcionesexportadas = {
    getRemito
}

module.exports = funcionesexportadas;