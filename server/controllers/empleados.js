const repositories = require('../repositories/empleados');

const getEmpleadosLegajos = async (req, res) => {
    res.status(200).send(await repositories.getEmpleadosLegajos());

}

module.exports = {
    getEmpleadosLegajos
}