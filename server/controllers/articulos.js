const repositories = require('../repositories/articulos');

const buscarArticulo = async (req, res) => {
    let cod = req.params.cod;
    res.status(200).send(await repositories.getArticulo(cod));

}
const buscarArticuloporEan = async (req, res) => {
    let ean = req.params.ean;
    res.status(200).send(await repositories.getArtEan(ean));

}
const buscarImagen = async (req, res) => {
    let cod = req.params.cod;
    res.status(200);
    res.writeHead(200, {'Content-Type': 'image/jpg'})
    res.end(await repositories.getImagen(cod))
}


module.exports = {
    buscarArticulo,
    buscarImagen,
    buscarArticuloporEan,

}