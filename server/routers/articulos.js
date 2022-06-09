const ArticulosController = require('../controllers/articulos')

module.exports = function (router) {
	router.get('/:cod', ArticulosController.buscarArticulo);
	router.get('/ean/:ean', ArticulosController.buscarArticuloporEan);
	router.get('/imagen/:cod', ArticulosController.buscarImagen);
	router.put('/editararticulo/:art_id', ArticulosController.editarArticulo);
	router.put('/editarstock',ArticulosController.editarStock);
	router.post('/ajustarstock',ArticulosController.ajustarStock);

}