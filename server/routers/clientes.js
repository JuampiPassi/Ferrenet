const ClientesController = require('../controllers/clientes')

module.exports = function (router) {
	router.get('/buscar/:cod_cli', ClientesController.getCliente);
}