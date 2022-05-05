const config = require('../config/config.json');
const firebird = require('node-firebird');
const logger = require('../logger');
const dbError = require('./db-error');

const getArticulo = async (query) => {

    try {

        let consulta = 'select * from ARTICULOS where =?';
        let data = [query.user, query.pass]
        let resp = await funcionesexportadas.consultaFirebird(consulta, data);

        if(resp.length != null && resp.length > 0){

            let jwtoken = jwt.sign(resp[0], 'secrect');

            let array = [jwtoken];

            return array;

        }else{
            return resp;
        }

      

    } catch (error) {
        logger.error('Error en el metodo getListListaUsuarios');
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