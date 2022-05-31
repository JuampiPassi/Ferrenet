
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
	router.get('/eliminararticulo/:cod', (req,res)=>{
		let cod = req.params.cod
		let consulta = `DELETE FROM STOCK_POLITICA WHERE COD_ART ='${cod}' AND POLITICA='PRUEBAS JUAN PABLO'`;
		//Hay que cambiar esa consulta para que borre el articulo de toda la tabla
		conexion.query(consulta,(error, results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	})

}