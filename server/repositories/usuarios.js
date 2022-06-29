const config = require('../config/config.json');
const firebird = require('node-firebird');
const logger = require('../logger');
const dbError = require('./db-error');

const getUsuarios = async () => {

    try {
        let consulta = 'select * from USUARIOS';
        console.log(consulta)
        return await funcionesexportadas.consultaFirebird(consulta);
      
    } catch (error) {
        logger.error('Error en el metodo getUsuarios');
        logger.error(error);
        return error;
    }
}

const getVerifPass = async (pass) =>{
    try {
        if(pass){
            let consulta = `select USUARIO, USU_ID from USUARIOS where USUARIOS.PASS='${pass}'`;
            let resp = await funcionesexportadas.consultaFirebird(consulta);

            return resp;
        }
    } catch (error) {
        logger.error('Error en el metodo getVerifPass');
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
    getUsuarios,
    getVerifPass,
    consultaFirebird,
}

module.exports = funcionesexportadas;