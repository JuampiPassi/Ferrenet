const conexion = require('../config/mysql2');

module.exports = function (router) {

	
	router.get('/buscar/:id', (req,res) =>{
		let consulta = `SELECT b.account_id_c, a.name from ven_box b, accounts a WHERE b.account_id_c=a.id AND  b.id=${req.params.id}`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});
}