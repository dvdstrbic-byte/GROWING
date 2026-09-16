const express = require("express");
const cors = require("cors");
const conexion = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servidor de GROWING funcionando");
});

app.get("/usuarios", (req, res) => {
    conexion.query("SELECT * FROM usuarios", (error, resultados) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error al consultar usuarios");
            return;
        }

        res.json(resultados);
    });
});

app.listen(3000, () => {
    console.log("Servidor funcionando en el puerto 3000");
});