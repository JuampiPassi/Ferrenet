const repositories = require('../repositories/comprobantes');

const getRemito = async (req, res) => {
    let cprdet_id = req.params.cprdet_id;
    res.status(200).send(await repositories.getRemito(cprdet_id));

}

module.exports = {
    getRemito
}