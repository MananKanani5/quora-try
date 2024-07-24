const mysql = require('mysql2');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "Manan@210502",
    database: "quora"
});

module.exports = connection;