const ArticulosController = require('../controllers/articulos')

module.exports = function (router) {
	router.get('/codigo/:cod', ArticulosController.buscarArticulo);
	router.get('/ean/:ean', ArticulosController.buscarArticuloporEan);
	router.get('/imagen/:cod', ArticulosController.buscarImagen);
	router.get('/cprdet/id', ArticulosController.getCprid);
	router.get('/fecingreso/:art_id',ArticulosController.getFecIngreso);
	router.get('/stockingreso/:art_id',ArticulosController.getStockIngreso);
	router.put('/editararticulo/:art_id', ArticulosController.editarArticulo);
	router.put('/editarstock',ArticulosController.editarStock);
	router.put('/editarubicacion',ArticulosController.editarUbicacion);
	router.post('/ajustarstock',ArticulosController.ajustarStock);
	router.post('/generarcpr',ArticulosController.postGenerarCpr);

}