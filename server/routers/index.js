const express = require('express');

module.exports = (app) => {
    let router = express.Router();
    
    require('./usuarios') (router)
    app.use('/api/usuarios', router);

    require('./politicas') (router);
    app.use('/api/politicas', router);
    
    require('./articulos') (router);
    app.use('/api/articulos', router);

    require('./empleados') (router);
    app.use('/api/empleados', router);

    require('./logistica') (router);
    app.use('/api/logistica', router);

    require('./auditoria') (router);
    app.use('/api/auditoria', router);


}