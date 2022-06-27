const EmpleadosController = require('../controllers/empleados')

module.exports = function (router) {
	router.get('/legajos', EmpleadosController.getEmpleadosLegajos);

}