const config = require('../config/config.json');
const firebird = require('node-firebird');
const logger = require('../logger');
const dbError = require('./db-error');
const fs = require('fs');
const  request  = require('request');

const getArticulo = async (cod) => {
    try {
    
        let consulta = `select DESCRIPCION, IMAGEN, EAN from ARTICULOS where ARTICULOS.COD_ART='${cod}'`;
        let resp = await funcionesexportadas.consultaFirebirdImagen(consulta);
        return resp;
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

const consultaFirebirdImagen = (consulta, info) => {

    let resultado = new Promise((resolve, reject) => {

        firebird.attach(config.firebird, function(err, db) {
            if (err){
                reject(err);
            }else{

                db.query(consulta, info, function(err, resp) {
                        if(err){
                            reject(err)
                        }else{
                           if(resp[0].IMAGEN!=null){
                               resp[0].IMAGEN(function(err, name,e){
                                   if(err)
                                        throw err;
                                   var buffers=[];
                                   e.on('data',function(chunk){
                                       buffers.push(chunk);
                                   });
                                   e.once('end',function(){
                                       var buffer = Buffer.concat(buffers);
                                       fs.writeFile('imgarticulo.png',buffer, err =>{
                                           if (err) throw err;
                                       });
                                       
                                   });
                               })
                           }else{
                           /*fs.rename('imgarticulo.png','img.png', function(err){
                                    if(err) console.log(err);
                                });*/
                            
                           } 
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
    consultaFirebirdImagen
}

module.exports = funcionesexportadas;