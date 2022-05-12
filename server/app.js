var express = require('express');
var proxy = require('express-http-proxy');
var path = require('path');
var morgan = require('morgan');
var logger = require('./logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config.json');
var app = express();
port = 3000;

logger.debug('Configurando CORS');
// CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS, DELETE');
	next();
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

logger.debug('Configurando endpoints');
require('./routers')(app);

app.get('/', (req, res) => {
	res.send('Hello desde app');
});

if(process.env.NODE_ENV == "development"){
	app.use('/', proxy(`localhost:${parseInt(config.PORT)+1}`));
}else{
	app.use('/', express.static(path.join(__dirname, '../dist')));
}

app.use(function(req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// let server = http.createServer(app);

// server
// 	.listen(config.PORT, () => {
// 	console.log(`Aplicacion corriendo en el puerto ${config.PORT}`);
// 	})
// 	.on("error", e => {
// 	console.error(`Error al iniciar el servidor (puerto ${config.PORT})`)
// 	console.error(e);
// 	});

app.use(function(err, req, res, _next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: err
	});
	res.render('error');
});



module.exports = app;
