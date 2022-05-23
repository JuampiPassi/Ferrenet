const config = require('../config/config.json');
const firebird = require('node-firebird');
const logger = require('../logger');
const dbError = require('./db-error');
const fs = require('fs');
const  request  = require('request');
const axios = require('axios')


const getArticulo = async (cod) => {
    try {
    
        let consulta = `select A.DESCRIPCION, A.EAN, A.MOD, A.MED, A.CANT_EMPAQ, S.EXISTENCIA, S.FECHA_CTRL from ARTICULOS A, STOCK S where A.COD_ART='${cod}' AND S.ART_ID=A.ART_ID AND A.EMP_ID=1 AND S.DEP_ID=1`;
        let resp = await funcionesexportadas.consultaFirebird(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo getArticulo');
        logger.error(error);
        return error;
    }
}

const getImagen = async (cod) => {
    try {
        let consulta = `SELECT IMAGEN, iif(IMAGEN is NULL, 1, 0) as ISNULL FROM ARTICULOS WHERE COD_ART='${cod} AND EMP_ID=1'`;
        let resp = await funcionesexportadas.consultaFirebirdImagen(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo getImagen');
        logger.error(error);
        return error;
    }
}

const getArtEan = async (ean) => {
    try {
        let consulta = `SELECT DESCRIPCION from ARTICULOS WHERE ARTICULOS.EAN='${ean} AND EMP_ID=1'`;
        let resp = await funcionesexportadas.consultaFirebird(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo getArtEan');
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
                            if(resp.length>0){

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
                                            resolve(buffer); 
                                        });
                                    })
                                    db.detach(); /*CIERRA LA CONEXION */
                                }else{
                                    let url = 'https://www.ibmhs.com/ss-content/not-found.jpg';
                                    request({ url, encoding: null }, (err, resp, buffer) => {
                                        resolve(buffer)
                                   });
                                   db.detach(); /*CIERRA LA CONEXION */
                                }
                            }else{
                                let url = 'https://www.ibmhs.com/ss-content/not-found.jpg';
                                request({ url, encoding: null }, (err, resp, buffer) => {
                                    resolve(buffer)
                                });
                                db.detach(); /*CIERRA LA CONEXION */
                            }
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
    getImagen,
    getArtEan,
    consultaFirebird,
    consultaFirebirdImagen
}

module.exports = funcionesexportadas;