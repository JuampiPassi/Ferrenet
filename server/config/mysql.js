var mysql = require('mysql');
const config = require('./config.json');

const connection = mysql.createConnection({
    host     : config.mariadb.host,
    user     : config.mariadb.user,
    password : config.mariadb.password,
    database : config.mariadb.database
});

connection.connect(function(err) {
    if(err){
        console.error('Error de conexion: ' + err.stack);
        return;
    }
});

module.exports = connection;
