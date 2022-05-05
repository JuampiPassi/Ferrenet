const express = require('express');

module.exports = (app) => {
    let router = express.Router();

    require('./articulos') (router);
    app.use('/api/articulos', router);
}