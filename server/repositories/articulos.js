const config = require('../config/config.json');
const firebirdMetodos = require('../lib/firebirdMetodos');
const firebird = require('node-firebird');
const logger = require('../logger');
const dbError = require('./db-error');
const  request  = require('request');
const axios = require('axios')


const getArticulo = async (cod) => {
    try {
    
        let consulta = `select A.ART_ID, A.DESCRIPCION, A.EAN, A.MOD, A.MED, A.CANT_EMPAQ, A.ESCALA_ID, S.EXISTENCIA, S.ORD_REC_STR,S.STK_ID, cast(S.FECHA_CTRL as date) as FECHA_CTRL from ARTICULOS A LEFT OUTER JOIN STOCK S ON S.ART_ID=A.ART_ID where A.COD_ART='${cod}' AND A.EMP_ID=1 AND S.DEP_ID=1`;
        let resp = await firebirdMetodos.getConsultaPaljet(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo getArticulo');
        logger.error(error);
        return error;
    }
}

const getFecIngreso = async(art_id)=>{
    try {
        let consulta = `select cast(max(fec_ingreso) as date) as fec_ingreso from STOCKMOV where art_id=${art_id} AND stk_tipomov_id='4'`;
        let resp = await firebirdMetodos.getConsultaPaljet(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo getFecIngreso');
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
        //let consulta = `SELECT COD_ART from ARTICULOS WHERE ARTICULOS.EAN='${ean}' AND EMP_ID=1`;
        let consulta = `select A.ART_ID, A.COD_ART, A.DESCRIPCION, A.MOD, A.MED, A.CANT_EMPAQ, A.ESCALA_ID, S.EXISTENCIA, S.ORD_REC_STR,S.STK_ID, cast(S.FECHA_CTRL as char(25)) as FECHA_CTRL from ARTICULOS A LEFT OUTER JOIN STOCK S ON S.ART_ID=A.ART_ID where A.EAN='${ean}' AND A.EMP_ID=1 AND S.DEP_ID=1`;
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
        //let resp = await funcionesexportadas.consultaFirebird(consulta);
        let resp = await firebirdMetodos.getConsultaPaljet(consulta);
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
        //let resp = await funcionesexportadas.consultaFirebird(consulta);
        let resp = await firebirdMetodos.getConsultaPaljet(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo putStock');
        logger.error(error);
        return error; 
    }
}

const postAjustar = async (data) =>{
    let consulta = `Insert into stockmov (STK_TIPOMOV_ID, CPR_ID, DEP_ID, ART_ID, FEC_INGRESO, ESCALA_ID, EXISTENCIA, CMETIDO, ARECIBIR, CPRDET_ID, STK_ID, CPRDET_CPRDET_ID)
    VALUES('3',${data.cpr_id},${data.dep_id},'${data.art_id}',(select cast('Now' as timestamp) from rdb$database),${data.escala_id},${data.ajuste},'0','0','1',${data.stock_id},'1')`;
    try {
        //let resp = await funcionesexportadas.consultaFirebird(consulta);
        let resp = await firebirdMetodos.getConsultaPaljet(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo postAjustar');
        logger.error(error);
        return error;
    }
}

const getCprid = async (data) =>{
    let fecha=data.fec_actual
    //let consulta = `SELECT CPR_ID from cprdet WHERE COD_ART='AJUSTE' AND MOD='01.02.2022' and DEP_DESTINO_ID=${data.dep_id}`
    let consulta = `SELECT CPR.CPR_ID FROM CPR,CPRDET WHERE CPR.CPR_ID=CPRDET.CPR_ID AND FEC_EMISION='${fecha}' AND COD_ART='AJUSTE' AND MOD='${fecha}' AND DEP_DESTINO_ID='${data.dep_id}'`;
    //let consulta = `SELECT CPR.CPR_ID FROM CPR,CPRDET WHERE CPR.CPR_ID=CPRDET.CPR_ID AND FEC_EMISION='01.02.2022' AND COD_ART='AJUSTE' AND MOD='01.02.2022' AND DEP_DESTINO_ID='${data.dep_id}'`;
        try {
            let resp = await firebirdMetodos.getConsultaPaljet(consulta);
            return resp;
        } catch (error) {
            logger.error('Error en el metodo getCprid');
            logger.error(error);
            return error;
        } 
}

const putUbicacion = async(data) =>{
    let consulta= `UPDATE STOCK SET ORD_REC_STR='${data.pos}' WHERE ART_ID=${data.art_id} AND DEP_ID=1`;
    try {
        let resp = await firebirdMetodos.getConsultaPaljet(consulta);
        return resp;
    } catch (error) {
        logger.error('Error en el metodo putUbicacion');
        logger.error(error);
        return error;
    } 
}

const generarCpr = async(fecha) =>{
    try {
        let cpr_id = await firebirdMetodos.getConsultaPaljet('execute procedure GET_CPR_ID')
        let cprdet_id = await firebirdMetodos.getConsultaPaljet('execute procedure GET_CPRDET_ID')
        let consulta1 = `INSERT INTO CPR (CPR_ID,EMP_ID,CPRETC_ID,CPR_TIPO_ID,CPR_CLASIF_ID,CPR_EST_ID,CTRL_ERR_CLASIF_ID,METODO_CALC_ID,DISCRIMINA_IMP,COMPUTA_IVA,BIEN_USO,FEC_EMISION,ENTTIPO_ID,NRO_ENT_ID,RZ,CUIT,IVA_ID,DOM,LOC_ID,LOCALIDAD,PROVINCIA_ID,TIPO_PAGO_ID,PORC_FINAN,DISCRIMINA_PORC,DECIMALES,MONEDA_ID,MONEDACAMBIO_ID,NOTA_CPR,ESQ_ID)
        VALUES (${cpr_id.CPR_ID},'1','34','SK','0','1','10','R','N','N','N','${fecha}','EMP','1','CMS S.A.','30708225300','RI','CMS S.A.  -  DEAN J. ALVAREZ 262','2','PARANA','A','CO','0','N','4','1','1','Comprobante generado con lector de Stock','1')`
        try {
            let resp1 = await firebirdMetodos.getConsultaPaljet(consulta1)
        } catch (error) {
            console.log('Error en CPR') 
            console.log(error) 
        }
        let consulta2 = `INSERT INTO CPRDET (CPRDET_ID,CPR_ID,ART_ID,COD_ART,DESCRIPCION,MOD,MED,DESC_IF,CANT,CANT_NO_PROC,ESCALA_ID,EQUIVALENCIA,MONEDA_COSTO_ID,PR_CTO_CPRA,PR_COSTO,UTILIDAD,PORC_DR,MONTO_DR,PR_VTA,PR_FINAL,PR_VTA_ORIG,PR_FINAL_ORIG,PR_NETO,MONEDACAMBIO_ID,DEP_ORIGEN_ID,DEP_DESTINO_ID,EQUIV_CANT,EQUIV_PR,TIPO_OPER_CANT)
        VALUES (${cprdet_id.CPRDET_ID},'${cpr_id.CPR_ID}','652161','AJUSTE','AJUSTE DE STOCK','${fecha}','','AJUSTE DE STOCK','1','1','12','1','1','1','0.01','0.0102','0','0','0','0','0','0','0','1','1','1','1','1','*')`
        try {
            let resp2 = await firebirdMetodos.getConsultaPaljet(consulta2);
        } catch (error) {
            console.log('Error en CPRDET')
            console.log(error)
        }
        return cpr_id
    } catch (error) {
        logger.error('Error en el metodo generarCpr');
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
    putUbicacion,
    getCprid,
    getFecIngreso,
    generarCpr,
    consultaFirebird,
    consultaFirebirdImagen
}

module.exports = funcionesexportadas;