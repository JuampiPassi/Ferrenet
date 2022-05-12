const config = require('../config/config.json');
const firebird = require('node-firebird');
const logger = require('../logger');
const dbError = require('./db-error');

const getArticulo = async (query) => {

    try {

       console.log('GetArticulo')

      

    } catch (error) {
        logger.error('Error en el metodo getArticulo');
        logger.error(error);
        return error;
    }
}



const consultaFirebird = (consulta, info) => {

    let resultado = new Promise((resolve, reject) => {

        firebird.attach(config.firebird, function(err, db) {
            if (err){
                reject(err);
            }else{

                db.query(consulta, info,
                    function(err, resp) {
                        if(err){
                            reject(err)
                        }else{
                            db.detach(); /*CIERRA LA CONEXION */
                            resolve(resp);
                        }
                    }
                );

            }

        });
    });

    return resultado;

}

const funcionesexportadas = {
    getArticulo,
    consultaFirebird,
}

module.exports = funcionesexportadas;