const repositories = require('../repositories/usuarios');

const verUsuarios = async (req, res) => {
    res.status(200).send(await repositories.getUsuarios());

}
const verifPass = async (req, res) => {
    res.status(200).send(await repositories.getVerifPass(req.query.pass));
}


module.exports = {
    verUsuarios,
    verifPass

}