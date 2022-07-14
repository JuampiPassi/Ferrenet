const ComprobantesController = require('../controllers/comprobantes')

module.exports = function (router) {
	router.get('/remito/:cprdet_id', ComprobantesController.getRemito);
}