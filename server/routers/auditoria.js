const conexion = require('../config/mysql');

module.exports = function (router) {

	
	router.get('/ordylimp/:usuario', (req,res) =>{
        let usuario=req.params.usuario
		let consulta = `SELECT id_persona_auditar, persona_auditar FROM auditoria_orden_y_limpieza WHERE VISIBLE='S' AND USUARIO='${usuario}' GROUP BY persona_auditar,id_persona_auditar`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

    router.get('/ordylimpsectores/:id', (req,res) =>{
		let consulta = `SELECT s.id, s.sector,s.descripcion FROM auditoria_orden_y_limpieza_sectores s, auditoria_orden_y_limpieza a WHERE s.id=a.sector_id AND a.id_persona_auditar='${req.params.id}' AND a.visible='S'`
		//let consulta = `SELECT id,sector FROM auditoria_orden_y_limpieza_sectores WHERE id_persona='${req.params.id}'`;
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
		let consulta = `UPDATE auditoria_orden_y_limpieza set evaluacion_id=${eval_id},nota='${nota}',visible='N' where id_persona_auditar='${persona_id}' AND sector_id='${sector_id}'`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

	router.get('/armonia/:usuario', (req,res) =>{
        let usuario=req.params.usuario
		let consulta = `SELECT persona_auditar,id_persona_auditar FROM auditoria_armonia WHERE VISIBLE='S' AND USUARIO='${usuario}' GROUP BY persona_auditar, id_persona_auditar`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

	router.get('/armoniaevaluacion', (req,res) =>{
		let consulta = `SELECT id,evaluacion,descripcion FROM auditoria_armonia_evaluacion`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

	router.get('/armoniaevaluar/:id', (req,res) =>{
		let consulta = `SELECT e.id,e.evaluar FROM auditoria_armonia_evaluar e, auditoria_armonia a WHERE a.evaluar_id=e.id AND a.id_persona_auditar='${req.params.id}' AND a.visible='S'`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

	router.put('/armonia', (req,res) =>{
        let id_persona=req.body.id_persona
        let evaluar_id=req.body.evaluar_id
        let evaluacion_id=req.body.evaluacion_id
        let nota=req.body.nota
		let consulta = `UPDATE auditoria_armonia set evaluacion_id=${evaluacion_id},nota='${nota}',visible='N' where evaluar_id=${evaluar_id} AND id_persona_auditar='${id_persona}'`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});
}