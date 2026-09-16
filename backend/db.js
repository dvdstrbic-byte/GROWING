const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "171970",
    database: "growing"
});

conexion.connect((error) => {
    if (error) {
        console.log("Error al conectar con MySQL:");
        console.log(error);
        return;
    }

    console.log("Conectado a MySQL");
});

module.exports = conexion;