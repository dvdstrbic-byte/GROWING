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
            return res.status(500).json({error: "Error al consultar usuarios"});
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
            return res.status(500).json({error: "Error al consultar artistas"});
        }
        res.json(resultados);
    });
});

app.get("/generos", (req, res)=>{
    conexion.query("SELECT id, nombre FROM generos", (error, resultados)=>{
        if(error){
            console.log(error);
            return res.status(500).json({error: "Error al consultar generos"});
        }
        res.json(resultados);
    });
});

app.get("/artistas/:id", (req, res)=>{
    const{id}=req.params;

    const sql= `
        SELECT 
            artistas.id, 
            artistas.usuario_id, 
            artistas.nombre_artistico, 
            artistas.descripcion, 
            artistas.link_musica,
            generos.nombre AS genero,
            (SELECT COUNT(*) FROM seguidores WHERE seguidores.artista_id = artistas.id) AS cantidad_seguidores
        FROM artistas
        LEFT JOIN generos ON artistas.genero_id = generos.id
        WHERE artistas.id = ?
    `;

    conexion.query(sql, [id], (error, resultados)=>{
        if(error){
            console.log(error);
            return res.status(500).json({error: "Error al consultar el artista"});
        }

        if(resultados.length===0){
            return res.status(404).json({error: "Artista no encontrado"});
        }

        res.json(resultados[0]);
    });
});

app.get("/artistas/:id/canciones",(req, res)=>{
    const {id}=req.params;

    conexion.query(
        "SELECT id, titulo, url FROM canciones WHERE artista_id = ?",
        [id],
        (error, resultados)=>{
            if(error){
                console.log(error);
                return res.status(500).json({error: "Error al consultar canciones"});
            }
            res.json(resultados);
        }
    );
});

app.post("/registro",(req, res)=>{
    const{ nombre, email, password, rol, nombreArtistico, descripcion, generoId, linkMusica, canciones } = req.body;

if(!nombre || !email || !password){
     return res.status(400).json({error: "Faltan datos obligatorios"});
  }

if(rol==="artista" && (!nombreArtistico || !generoId)){
        return res.status(400).json({error: "Faltan datos del artista"});
  }

conexion.query(
    "SELECT id FROM usuarios WHERE email = ?",
    [email],
    (error, resultados)=>{
if(error){
    console.log(error);
          return res.status(500).json({error: "Error del servidor"});
 }

if(resultados.length>0){
        return res.status(409).json({error: "Ese email ya está registrado"});
     }

 conexion.query(
     "INSERT INTO usuarios (nombre, email, contraseña, tipo_usuario) VALUES (?, ?, ?, ?)",
         [nombre, email, password, rol || "oyente"],
 (error, resultado)=>{
      if(error){
        console.log(error);
      return res.status(500).json({error: "Error al crear usuario"});
    }

const nuevoUsuarioId=resultado.insertId;

 if(rol==="artista"){
    conexion.query(
     "INSERT INTO artistas (usuario_id, nombre_artistico, descripcion, genero_id, link_musica) VALUES (?, ?, ?, ?, ?)",
    [nuevoUsuarioId, nombreArtistico, descripcion || "", generoId, linkMusica || null],
        (error, resultadoArtista)=>{
    
    if(error){
      console.log(error);
    return res.status(500).json({error: "Error al crear el perfil de artista"});
  }

const nuevoArtistaId=resultadoArtista.insertId;
    
    if(Array.isArray(canciones)){
        canciones
          .filter((titulo)=>titulo && titulo.trim() !== "")
          .forEach((titulo)=>{
        conexion.query(
            "INSERT INTO canciones (artista_id, titulo) VALUES (?, ?)",
        [nuevoArtistaId, titulo],
        (error)=>{
         if (error) console.log("Error al guardar tema sugerido:", error);
        });
    });
}

res.status(201).json({
    mensaje: "Usuario creado",
        usuario: {id: nuevoUsuarioId, nombre, email, rol}
    });
 });
    }else{
      res.status(201).json({
         mensaje: "Usuario creado",
            usuario:{id: nuevoUsuarioId, nombre, email, rol: rol || "oyente"}
             });             
         }});
     });
});

app.post("/login", (req, res)=>{
    const{ email, password }=req.body;

    if(!email || !password){
        return res.status(400).json({error: "Faltan datos"});
    }

    conexion.query(
    "SELECT * FROM usuarios WHERE email = ? AND contraseña = ?",
    [email, password],
    (error, resultados)=>{
if(error){
    console.log(error);
    return res.status(500).json({error: "Error del servidor"});
}

if(resultados.length===0){
     return res.status(401).json({error: "Email o contraseña incorrectos"});
}

    const usuario=resultados[0];

     res.json({
        mensaje:"Login exitoso",
         usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.tipo_usuario
                }
            });
        });
});


app.post("/seguidores",(req, res)=>{
    const{usuarioId, artistaId}=req.body;

    if(!usuarioId || !artistaId){
        return res.status(400).json({error: "Faltan datos"});
    }

    conexion.query(
        "INSERT INTO seguidores (usuario_id, artista_id) VALUES (?, ?)",
        [usuarioId, artistaId],
        (error)=>{
            if(error){
                if(error.code==="ER_DUP_ENTRY"){
                    return res.status(200).json({mensaje: "Ya seguís a este artista"});
                }
                console.log(error);
                return res.status(500).json({error: "Error al seguir al artista"});
            }
            res.status(201).json({mensaje: "Ahora seguís a este artista"});
        });
    });


app.delete("/seguidores", (req, res)=>{
    const {usuarioId, artistaId }=req.body;

    if(!usuarioId || !artistaId){
        return res.status(400).json({error: "Faltan datos"});
    }

    conexion.query(
        "DELETE FROM seguidores WHERE usuario_id = ? AND artista_id = ?",
        [usuarioId, artistaId],
        (error)=>{
            if(error){
                console.log(error);
                return res.status(500).json({error: "Error al dejar de seguir"});
            }
            res.json({mensaje: "Dejaste de seguir a este artista"});
        });
    });

app.get("/seguidores/estado/:usuarioId/:artistaId",(req, res)=>{
    const {usuarioId, artistaId}=req.params;

    conexion.query(
        "SELECT id FROM seguidores WHERE usuario_id = ? AND artista_id = ?",
        [usuarioId, artistaId],
        (error, resultados)=>{
            if(error){
                console.log(error);
                return res.status(500).json({error: "Error al consultar"});
            }
            res.json({siguiendo: resultados.length>0});
        });
    });

app.listen(3000, "0.0.0.0",()=>{
    console.log("Servidor funcionando en el puerto 3000");
});