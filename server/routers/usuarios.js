const UsuariosController = require('../controllers/usuarios');
const conexion = require('../config/mysql');
const conexion2 = require('../config/mysql2');

module.exports = function (router) {
	//router.get('/', UsuariosController.verUsuarios);
    router.get('/verif',UsuariosController.verifPass);
    router.get('/rol/:usuario', (req,res) =>{
        let consulta= `SELECT u.id_rol FROM  usuarios_roles u WHERE u.usuario='${req.params.usuario}'`;
        conexion.query(consulta,(error,results)=>{
			if(error){
                console.log("El usuario no tiene rol")
				throw(error)
			}else{
                if(results[0].id_rol==1){
                    res.status(200).send({id_rol:1});  
                }else{
                    let consulta2=`SELECT r.id_modulo FROM roles_modulos r WHERE r.id_rol=${results[0].id_rol} AND r.visible='SI'`;
                    conexion.query(consulta2,(error,results2)=>{
                        if(error){
                            throw(error)
                        }else{
                            res.status(200).send({id_rol:results[0].id_rol,modulos:results2});
                        }
                    })
                }
			}
		})
    });

    router.get('/todos', (req,res) =>{
		let consulta = `SELECT id,first_name,last_name FROM users WHERE status='Active' order by last_name`;
		conexion2.query(consulta,(error,results)=>{
			if(error){
				throw(error)
			}else{
				res.status(200).send(results);
			}
		})
	});
}