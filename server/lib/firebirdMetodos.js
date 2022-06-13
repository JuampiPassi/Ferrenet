const {getPaljetTransac} = require("./firebird")

const getConsultaPaljet = async (consulta, params) => {
    let tr
    try {
        tr = await getPaljetTransac()
        let data = await tr.query(consulta, params)
        await tr.commit()
        return data
    } catch (error) {
        if (tr) await tr.rollback()
        throw error
    }
}

module.exports = {
    getConsultaPaljet
}