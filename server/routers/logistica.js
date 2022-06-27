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
}