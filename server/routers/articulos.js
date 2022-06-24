const ArticulosController = require('../controllers/articulos')

module.exports = function (router) {
	router.get('/:cod', ArticulosController.buscarArticulo);
	router.get('/ean/:ean', ArticulosController.buscarArticuloporEan);
	router.get('/imagen/:cod', ArticulosController.buscarImagen);
	router.get('/cprdet/id', ArticulosController.getCprid);
	router.get('/fecingreso/:art_id',ArticulosController.getFecIngreso);
	router.put('/editararticulo/:art_id', ArticulosController.editarArticulo);
	router.put('/editarstock',ArticulosController.editarStock);
	router.put('/editarubicacion',ArticulosController.editarUbicacion);
	router.post('/ajustarstock',ArticulosController.ajustarStock);

}