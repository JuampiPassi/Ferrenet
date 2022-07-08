const conexion = require('../config/mysql2');

module.exports = function (router) {

	
	router.get('/todas/:usuario', (req,res) =>{
		let consulta = `SELECT t.id,t.name,u.user_name,t.description, DATE(t.date_due) AS fecha FROM tasks t, users u WHERE t.assigned_user_id=u.id AND t.deleted=0 AND t.status <> 'Completed' AND u.user_name='${req.params.usuario}' ORDER BY t.date_due asc`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

    router.put('/editar',(req,res) =>{
        let fecha = req.body.fecha
        let id = req.body.id
        let consulta = `UPDATE tasks SET status='Completed',date_modified='${fecha}' WHERE id='${id}'`
        conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
    });
}