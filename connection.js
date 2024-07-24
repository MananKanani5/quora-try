const mysql = require('mysql2');

let connection = mysql.createConnection({
    host: 'b4fns07m2f4ifunp9ira-mysql.services.clever-cloud.com',
    user: 'u3qecqaodrblskes',
    password: "xSC9WIi19dPvgfDfIJv6",
    database: "b4fns07m2f4ifunp9ira",
    port: 3306
});

module.exports = connection;