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
		let consulta = `SELECT cod_art, descripcion,MOD1, med, cant_no_proc, stock,empaque, orden_str,fec_ctrol,fec_ult_ingr FROM LOGISTICA_CONS_DET WHERE cons_id=${id} AND deleted=0 ORDER BY orden_str,descripcion,MOD1,med`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});
}