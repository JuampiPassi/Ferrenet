const UsuariosController = require('../controllers/usuarios')

module.exports = function (router) {
	//router.get('/', UsuariosController.verUsuarios);
    router.get('/verif',UsuariosController.verifPass);
}