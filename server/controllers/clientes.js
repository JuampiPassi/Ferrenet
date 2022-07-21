const repositories = require('../repositories/clientes');

const getCliente = async (req, res) => {
    let cod_cli = req.params.cod_cli;
    res.status(200).send(await repositories.getCliente(cod_cli));

}

module.exports = {
    getCliente
}