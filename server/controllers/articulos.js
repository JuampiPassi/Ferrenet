const repositories = require('../repositories/articulos');

const buscarArticulo = async (req, res) => {

    res.status(200).send(await repositories.getArticulo(req.cod));

}


module.exports = {
    buscarArticulo

}