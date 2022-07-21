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
    
    require('./tareas') (router);
    app.use('/api/tareas', router);
    
    require('./capacitaciones') (router);
    app.use('/api/capacitaciones', router);
    
    require('./comprobantes') (router);
    app.use('/api/comprobantes', router);
    
    require('./box') (router);
    app.use('/api/box', router);
    
    require('./clientes') (router);
    app.use('/api/clientes', router);

}