
const conexion = require('../config/mysql');

module.exports = function (router) {

	
	router.get('/articulos/:id', (req,res) =>{
		let consulta = 'SELECT COD_ART from STOCK_POLITICA WHERE POLITICA=? ORDER BY ORDEN';
		conexion.query(consulta,[req.params.id],(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});
	router.get('/', (req,res)=>{
		let consulta = 'SELECT POLITICA from STOCK_POLITICA GROUP BY POLITICA';
		conexion.query(consulta,(error, results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

}