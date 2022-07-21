const conexion = require('../config/mysql2');

module.exports = function (router) {

	
	router.get('/buscar/:id', (req,res) =>{
		let consulta = `SELECT b.account_id_c, a.name from ven_box b LEFT JOIN accounts a ON b.account_id_c=a.id WHERE  b.id=${req.params.id}`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

	router.delete('/remitos', (req,res) =>{
		let consulta = `DELETE from box_box_remitos where (cprdet_id, bultos) IN (${req.body.datos})`
		console.log(consulta)
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});
	 
	router.post('/remitos', (req,res) =>{
		let remitos = req.body.remitos
		let valores=''
		remitos.forEach(element => {
			valores+=`(\"${element.id}\",\"${element.name}\",\"${element.fechahora}\",\"${element.nro_bulto}\",\"${element.cprdet_id}\",\"${element.cpr_id}\",\"${element.box}\",\"${element.cliente}\",\"${element.fecha}\",${element.nro},\"${element.nro_cpr}\"),`
		});
		valores = valores.slice(0,-1)//elimino la ultima ","
		let consulta = `INSERT INTO box_box_remitos(id,name,date_modified,bultos,cprdet_id,cpr_id,boc,description,fecha,nro,nro_cpr) VALUES ${valores}`
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

	router.put('/asignar',(req,res)=>{
		let box_id=req.body.box_id
		let cod_cli=req.body.cliente
		let fecha=req.body.fecha
		let consulta = `UPDATE ven_box set account_id_c='${cod_cli}', account_id1_c='${cod_cli}', preparado='${fecha}' WHERE id='${box_id}'`
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	})
}