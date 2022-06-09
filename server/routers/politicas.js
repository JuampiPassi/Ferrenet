
const conexion = require('../config/mysql');

module.exports = function (router) {

	
	router.get('/articulos/:id', (req,res) =>{
		let consulta = 'SELECT COD_ART, DEPOSITO from STOCK_POLITICA WHERE POLITICA=? ORDER BY ORDEN';
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
	router.delete('/eliminararticulo', (req,res)=>{
		let cod_art = req.body.cod_art
		let dep_id = req.body.dep_id
		let consulta = `DELETE FROM STOCK_POLITICA WHERE COD_ART ='${cod_art}' AND DEPOSITO=${dep_id}`;
		conexion.query(consulta,(error, results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});
	router.get('/motivos', (req,res)=>{
		let consulta = `SELECT * FROM articulos_no_escaneados_motivos`;
		conexion.query(consulta,(error, results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});
	router.post('/noescaneado',(req,res)=>{
		let art_id=req.body.art_id
		let cod_art=req.body.cod_art
		let usuario=req.body.usuario
		let motivo_id=req.body.motivo_id
		let consulta = `INSERT INTO articulos_no_escaneados (ART_ID,COD_ART,USUARIO,MOTIVO_ID) VALUES (${art_id},'${cod_art}','${usuario}',${motivo_id})`;
		conexion.query(consulta,(error, results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});
	router.post('/ajuste',(req,res)=>{
		let cod_art=req.body.cod_art
		let art_id=req.body.art_id
		let dep_id=req.body.dep_id
		let ajuste=req.body.ajuste
		let consulta = `INSERT INTO STOCK_ACLAJE_AJUSTES (COD_ART, FECHA, ART_ID, DEP_ID, AJUSTE) VALUES ('${cod_art}',(SELECT NOW()),${art_id},${dep_id},${ajuste})`;
		conexion.query(consulta,(error, results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	})

}