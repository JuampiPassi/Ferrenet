const conexion = require('../config/mysql');

module.exports = function (router) {

	
	router.get('/cons', (req,res) =>{
		let consulta = `SELECT cons_id, usuario, fecha FROM LOGISTICA_CONS WHERE cons_est='1' AND DELETED='0' GROUP BY CONS_ID, USUARIO, FECHA`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

	router.get('/consdet/:id', (req,res) =>{
		let id = req.params.id
		let consulta = `SELECT cons_det_id, cod_art, descripcion,MOD1, med, cant_no_proc, stock,empaque, orden_str,fec_ctrol,fec_ult_ingr FROM LOGISTICA_CONS_DET WHERE cons_id=${id} AND deleted=0 ORDER BY orden_str,descripcion,MOD1,med`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

	router.put('/visualizando', (req,res) =>{
		let id=req.body.cons_det_id
		let usuario=req.body.usuario
		let consulta = `UPDATE LOGISTICA_CONS_DET SET VISUALIZANDO=${usuario} WHERE CONS_DET_ID=${id}`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

	router.put('/editararticulo', (req,res)=>{
		let preparado=req.body.preparado;
		let usu_id=req.body.usuario;
		let cons_det_id=req.body.cons_det_id;
		let consulta = `UPDATE LOGISTICA_CONS_DET SET PREPARADO=${preparado}, STOCK_TEMP=${preparado}, ART_CARGADO='S', USUARIO=${usu_id}, VISUALIZANDO=0 WHERE CONS_DET_ID=${cons_det_id}`
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	})
}