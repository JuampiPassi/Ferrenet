const ArticulosController = require('../controllers/articulos')

module.exports = function (router) {
	router.get('/:cod', ArticulosController.buscarArticulo);
}