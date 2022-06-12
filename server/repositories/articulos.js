const config = require('../config/config.json');
const firebirdMetodos = require('../lib/firebirdMetodos');
const firebird = require('node-firebird');
const logger = require('../logger');
const dbError = require('./db-error');
const  request  = require('request');
const axios = require('axios')


const getArticulo = async (cod) => {
    try {
    
        let consulta = `select A.ART_ID, A.DESCRIPCION, A.EAN, A.MOD, A.MED, A.CANT_EMPAQ, A.ESCALA_ID, S.EXISTENCIA, S.ORD_REC_STR,S.STK_ID, cast(S.FECHA_CTRL as char(25)) as FECHA_CTRL from ARTICULOS A LEFT OUTER JOIN STOCK S ON S.ART_ID=A.ART_ID where A.COD_ART='${cod}' AND A.EMP_ID=1 AND S.DEP_ID=1`;
        //let resp = await funcionesexportadas.consultaFirebird(consulta);
        let resp = await firebirdMetodos.getConsultaPaljet(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo getArticulo');
        logger.error(error);
        return error;
    }
}

const getImagen = async (cod) => {
    try {
        let consulta = `SELECT IMAGEN, iif(IMAGEN is NULL, 1, 0) as ISNULL FROM ARTICULOS WHERE COD_ART='${cod}'`;
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
        let consulta = `SELECT COD_ART from ARTICULOS WHERE ARTICULOS.EAN='${ean}' AND EMP_ID=1`;
        let resp = await funcionesexportadas.consultaFirebird(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo getArtEan');
        logger.error(error);
        return error; 
    }
}

const putArticulo = async (art_id) =>{
    try {
        let consulta = `UPDATE ARTICULOS SET EXIST_NEG='N' WHERE ART_ID=${art_id}`;
        let resp = await funcionesexportadas.consultaFirebird(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo putArticulo');
        logger.error(error);
        return error; 
    }
}

const putStock = async (id,dep_id) => {
    try {
        let consulta = `UPDATE STOCK SET FECHA_CTRL=(SELECT CAST ('Now' as date) from rdb$database) WHERE ART_ID=${id} AND DEP_ID=${dep_id}`;
        let resp = await funcionesexportadas.consultaFirebird(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo putStock');
        logger.error(error);
        return error; 
    }
}

const postAjustar = async (data) =>{
    let consulta = `Insert into stockmov (STK_TIPOMOV_ID, CPR_ID, DEP_ID, ART_ID, FEC_INGRESO, ESCALA_ID, EXISTENCIA, CMETIDO, ARECIBIR, CPRDET_ID, STK_ID, CPRDET_CPRDET_ID)
    VALUES('3',(SELECT CPR_ID from cprdet WHERE COD_ART='AJUSTE' AND MOD='01.02.2022' and DEP_DESTINO_ID=${data.dep_id}),${data.dep_id},'${data.art_id}',(select cast('Now' as timestamp) from rdb$database),${data.escala_id},${data.ajuste},'0','0','1',${data.stock_id},'1')`;
    try {
        let resp = await funcionesexportadas.consultaFirebird(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo postAjustar');
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
                                    let url = 'https://e-cycles.com.py/assets/meemba/images/default_product_image.png';
                                    request({ url, encoding: null }, (err, resp, buffer) => {
                                        resolve(buffer)
                                   });
                                   db.detach(); /*CIERRA LA CONEXION */
                                }
                            }else{
                                let url = 'https://e-cycles.com.py/assets/meemba/images/default_product_image.png';
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
    putArticulo,
    putStock,
    postAjustar,
    consultaFirebird,
    consultaFirebirdImagen
}

module.exports = funcionesexportadas;