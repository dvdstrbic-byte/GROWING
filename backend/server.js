const express=require("express");
const cors=require("cors");
const conexion=require("./db");

const app=express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Servidor de GROWING funcionando");
});

app.get("/usuarios", (req, res)=>{
    conexion.query("SELECT * FROM usuarios", (error, resultados)=>{
        if(error){
            console.log(error);
            return res.status(500).json({ error: "Error al consultar usuarios" });
        }
        res.json(resultados);
    });
});

app.get("/artistas", (req, res)=>{
    const sql = `SELECT artistas.id, artistas.usuario_id, artistas.nombre_artistico, artistas.descripcion, generos.nombre AS genero FROM artistas
        LEFT JOIN generos ON artistas.genero_id = generos.id`;

    conexion.query(sql, (error, resultados)=>{
        if(error){
            console.log(error);
            return res.status(500).json({ error: "Error al consultar artistas" });
        }
        res.json(resultados);
    });
});

app.get("/generos", (req, res)=>{
    conexion.query("SELECT id, nombre FROM generos", (error, resultados)=>{
        if(error){
            console.log(error);
            return res.status(500).json({ error: "Error al consultar generos" });
        }
        res.json(resultados);
    });
});

app.get("/artistas/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT 
            artistas.id, 
            artistas.usuario_id, 
            artistas.nombre_artistico, 
            artistas.descripcion, 
            generos.nombre AS genero
        FROM artistas
        LEFT JOIN generos ON artistas.genero_id = generos.id
        WHERE artistas.id = ?
    `;

    conexion.query(sql, [id], (error, resultados) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al consultar el artista" });
        }

        if (resultados.length === 0) {
            return res.status(404).json({ error: "Artista no encontrado" });
        }

        res.json(resultados[0]);
    });
});

app.get("/artistas/:id/canciones", (req, res) => {
    const { id } = req.params;

    conexion.query(
        "SELECT id, titulo, url FROM canciones WHERE artista_id = ?",
        [id],
        (error, resultados) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Error al consultar canciones" });
            }
            res.json(resultados);
        }
    );
});

app.post("/registro", (req, res)=>{
    const{ nombre, email, password, rol, nombreArtistico, descripcion, generoId } = req.body;

    if(!nombre || !email || !password){
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    if(rol==="artista" && (!nombreArtistico || !generoId)){
        return res.status(400).json({ error: "Faltan datos del artista" });
    }

conexion.query(
    "SELECT id FROM usuarios WHERE email = ?",
    [email],
    (error, resultados)=>{
    if(error){
        console.log(error);
        return res.status(500).json({ error: "Error del servidor" });
    }

    if(resultados.length>0){
        return res.status(409).json({ error: "Ese email ya está registrado" });
    }

    conexion.query(
        "INSERT INTO usuarios (nombre, email, contraseña, tipo_usuario) VALUES (?, ?, ?, ?)",
            [nombre, email, password, rol || "oyente"],
        (error, resultado)=>{
    if(error){
        console.log(error);
        return res.status(500).json({ error: "Error al crear usuario" });
    }

 const nuevoUsuarioId=resultado.insertId;

if(rol==="artista"){
     conexion.query(
     "INSERT INTO artistas (usuario_id, nombre_artistico, descripcion, genero_id) VALUES (?, ?, ?, ?)",
 [nuevoUsuarioId, nombreArtistico, descripcion || "", generoId],
    (error)=>{
    if(error){
        console.log(error);
         return res.status(500).json({ error: "Error al crear el perfil de artista" });
    }

        res.status(201).json({
            mensaje: "Usuario creado",
            usuario:{ id: nuevoUsuarioId, nombre, email, rol }
                    });
                        }
                    );
            }else{
                res.status(201).json({
                    mensaje: "Usuario creado",
                    usuario: { id: nuevoUsuarioId, nombre, email, rol: rol || "oyente" }
            });
        }});
    });
});

app.post("/login", (req, res)=>{
    const{ email, password }=req.body;

    if(!email || !password){
        return res.status(400).json({ error: "Faltan datos" });
    }

    conexion.query(
    "SELECT * FROM usuarios WHERE email = ? AND contraseña = ?",
    [email, password],
    (error, resultados)=>{
if(error){
    console.log(error);
    return res.status(500).json({ error: "Error del servidor" });
}

if(resultados.length===0){
     return res.status(401).json({ error: "Email o contraseña incorrectos" });
}

    const usuario=resultados[0];

     res.json({
        mensaje: "Login exitoso",
         usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.tipo_usuario
                }
            });
        });
});

app.listen(3000, "0.0.0.0",()=>{
    console.log("Servidor funcionando en el puerto 3000");
});