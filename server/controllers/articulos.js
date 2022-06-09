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

const editarArticulo = async (req,res)=>{
    let art_id = req.params.art_id;
    res.status(200).send(await repositories.putArticulo(art_id));
}

const editarStock = async (req,res)=>{
    let id = req.body.art_id;
    let dep_id = req.body.dep_id;
    res.status(200).send(await repositories.putStock(id,dep_id));
}

const ajustarStock = async (req,res)=>{
    console.log(req.body)
    res.status(200).send(await repositories.postAjustar(req.body));
}


module.exports = {
    buscarArticulo,
    buscarImagen,
    editarStock,
    ajustarStock,
    buscarArticuloporEan,
    editarArticulo

}