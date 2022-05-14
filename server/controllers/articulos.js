const repositories = require('../repositories/articulos');

const buscarArticulo = async (req, res) => {
    let cod = req.params.cod;
    res.status(200).send(await repositories.getArticulo(cod));

}


module.exports = {
    buscarArticulo

}