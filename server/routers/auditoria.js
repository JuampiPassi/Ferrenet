const conexion = require('../config/mysql');

module.exports = function (router) {

	
	router.get('/ordylimp', (req,res) =>{
		let consulta = `SELECT id_persona_auditar, persona_auditar FROM auditoria_orden_y_limpieza WHERE VISIBLE='S' GROUP BY persona_auditar,id_persona_auditar`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

    router.get('/ordylimpsectores/:id', (req,res) =>{
		let consulta = `SELECT id,sector FROM auditoria_orden_y_limpieza_sectores WHERE id_persona='${req.params.id}'`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

    router.get('/ordylimpevaluacion', (req,res) =>{
		let consulta = `SELECT id,evaluacion FROM auditoria_orden_y_limpieza_evaluacion`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

    router.put('/ordylimp', (req,res) =>{
        let persona_id=req.body.persona_id
        let eval_id=req.body.eval_id
        let nota=req.body.nota
        let sector_id=req.body.sector_id
		let consulta = `UPDATE auditoria_orden_y_limpieza set evaluacion_id=${eval_id},nota='${nota}',visible='N' where id_persona_auditar='${persona_id}' AND sector_id=${sector_id}`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});
}