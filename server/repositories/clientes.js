const config = require('../config/config.json');
const firebirdMetodos = require('../lib/firebirdMetodos');
const logger = require('../logger');
const axios = require('axios')


const getCliente = async (cod_cli) => {
    try {
        let consulta = `select * from clientes where cod_cli=${cod_cli}`;
        console.log(consulta)
        let resp = await firebirdMetodos.getConsultaPaljet(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo getCliente');
        logger.error(error);
        return error;
    }
}

const funcionesexportadas = {
    getCliente
}

module.exports = funcionesexportadas;