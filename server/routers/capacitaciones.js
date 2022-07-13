const conexion = require('../config/mysql2');
const { v4: uuidv4 } = require('uuid');

module.exports = function (router) {

	
	router.post('/registro', (req,res) =>{
        let descripcion = req.body.descripcion
		let fecha = req.body.fecha
		let lugar = req.body.lugar
		let instructor = req.body.capacitador
		let carga_horaria = req.body.carga_horaria
		let nombre = req.body.nombre
		let participantes= req.body.participantes
		let id = req.body.id
		let usuarios=''
		let idusuarios=''
		for(var i = 0; i < participantes.length; i++){
			usuarios+="user_id"+(i+1)+"_c,"
			idusuarios+=`\"${participantes[i]}\",`
		}
		usuarios = usuarios.slice(0,-1)//elimino la ultima ","
		idusuarios = idusuarios.slice(0,-1)//elimino la ultima ","
		let consulta = `INSERT INTO iso_registro_de_capacitaciones (id,description,fecha,lugar,instructor,carga_horaria,nombre,${usuarios}) 
						VALUES ('${id}','${descripcion}','${fecha}','${lugar}','${instructor}',${carga_horaria},'${nombre}',${idusuarios})`;				
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});

	router.post('/participantes',(req,res)=>{
		let participantes = req.body.participantes
		let id_capacitacion = req.body.id_capacitacion
		let valores=''
		let id=''
		participantes.forEach(element => {
			id = uuidv4();
			valores+=`(\"${id}\",(SELECT id FROM rrhh_datospersonales WHERE user_id_c='${element}'),\"${id_capacitacion}\"),`
		});
		valores = valores.slice(0,-1)//elimino la ultima ","
		let consulta =`INSERT INTO rrhh_datospersonales_iso_registro_de_capacitaciones_c (id,rrhh_datosd231sonales_ida,rrhh_datosd2deaciones_idb) VALUES ${valores}`;
		conexion.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	})
}