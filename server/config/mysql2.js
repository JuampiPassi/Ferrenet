var mysql = require('mysql');
const config = require('./config.json');

const connection = mysql.createConnection({
    host     : config.mysql.host,
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database
});

connection.connect(function(err) {
    if(err){
        console.error('Error de conexion: ' + err.stack);
        return;
    }
});

module.exports = connection;
