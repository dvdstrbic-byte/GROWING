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
    const sql = `
    SELECT artistas.id, 
    artistas.usuario_id, 
    artistas.nombre_artistico, 
    artistas.descripcion, 
    GROUP_CONCAT(generos.nombre SEPARATOR ', ') AS genero
    FROM artistas
    LEFT JOIN artista_generos ON artista_generos.artista_id = artistas.id
    LEFT JOIN generos ON generos.id = artista_generos.genero_id
    GROUP BY artistas.id
    `;

    conexion.query(sql, (error, resultados)=>{
        if(error){
            console.log(error);
            return res.status(500).json({error: "Error al consultar artistas"});
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
            GROUP_CONCAT(generos.nombre SEPARATOR ', ') AS genero,
            (SELECT COUNT(*) FROM seguidores WHERE seguidores.artista_id = artistas.id) AS cantidad_seguidores
        FROM artistas
        LEFT JOIN artista_generos ON artista_generos.artista_id = artistas.id
        LEFT JOIN generos ON generos.id = artista_generos.genero_id
        WHERE artistas.id = ?
        GROUP BY artistas.id
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

app.get("/generos", (req, res)=>{
    conexion.query("SELECT id, nombre FROM generos", (error, resultados)=>{
        if(error){
            console.log(error);
            return res.status(500).json({error: "Error al consultar generos"});
        }
        res.json(resultados);
    });
});


app.post("/registro",(req, res)=>{
    const{ nombre, email, password, rol, nombreArtistico, descripcion, generoIds, linkMusica, canciones } = req.body;

if(!nombre || !email || !password){
     return res.status(400).json({error: "Faltan datos obligatorios"});
  }

if(rol==="artista" && (!nombreArtistico || !Array.isArray(generoIds) || generoIds.length===0)){
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
     "INSERT INTO artistas (usuario_id, nombre_artistico, descripcion, link_musica) VALUES (?, ?, ?, ?)",
    [nuevoUsuarioId, nombreArtistico, descripcion || "", linkMusica || null],
        (error, resultadoArtista)=>{
    
    if(error){
      console.log(error);
    return res.status(500).json({error: "Error al crear el perfil de artista"});
  }

const nuevoArtistaId=resultadoArtista.insertId;

  generoIds.forEach((generoId)=>{
    conexion.query(
        "INSERT INTO artista_generos (artista_id, genero_id) VALUES (?, ?)",
    [nuevoArtistaId, generoId],
    (error)=>{
         if (error) console.log("Error al guardar género:", error);
      });
    });
    
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
         usuario:{
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

    app.get("/usuarios/:id/seguidos", (req, res)=>{
    const {id}=req.params;

    const sql=`
        SELECT artistas.id, artistas.nombre_artistico
        FROM seguidores
        JOIN artistas ON seguidores.artista_id = artistas.id
        WHERE seguidores.usuario_id = ?
    `;

    conexion.query(sql,[id],(error, resultados)=>{
        if(error){
            console.log(error);
            return res.status(500).json({error: "Error al consultar seguidos"});
        }
        res.json(resultados);
    });
});

app.get("/artistas/usuario/:usuarioId", (req, res)=>{
    const {usuarioId}=req.params;

    const sql= `
        SELECT
            id,
            nombre_artistico,
            descripcion,
            link_musica,
            (SELECT COUNT(*) FROM seguidores WHERE seguidores.artista_id = artistas.id) AS cantidad_seguidores
        FROM artistas
        WHERE usuario_id = ?
    `;

    conexion.query(sql, [usuarioId], (error, resultados)=>{
        if(error){
            console.log(error);
            return res.status(500).json({
                error: "Error al consultar artista"
            });
        }

        if(resultados.length===0){
            return res.status(404).json({
                error: "Artista no encontrado"
            });
        }

        res.json(resultados[0]);
    });
});

app.get("/artistas/:id/seguidores-lista", (req, res)=>{
    const {id}=req.params;

    const sql= `
        SELECT usuarios.id, usuarios.nombre
        FROM seguidores
        JOIN usuarios ON seguidores.usuario_id = usuarios.id
        WHERE seguidores.artista_id = ?
    `;

    conexion.query(sql, [id], (error, resultados)=>{
        if(error){
            console.log(error);
            return res.status(500).json({error: "Error al consultar seguidores"});
        }
        res.json(resultados);
    
    });
});

app.get("/artistas/:id/generos", (req, res)=>{
    const {id}=req.params;

    conexion.query(
        "SELECT genero_id FROM artista_generos WHERE artista_id = ?",
        [id],
        (error, resultados)=>{
            if(error){
                console.log(error);
                return res.status(500).json({
                    error: "Error al consultar géneros"
                });
            }

            res.json(resultados);
        }
    );
});

app.put("/usuarios/:id", (req, res)=>{
    const {id}=req.params;
    const {nombre, email, password, nombreArtistico, descripcion, linkMusica, generoIds, canciones}=req.body;

    if(!nombre || !email){
        return res.status(400).json({error: "Faltan datos obligatorios"});
    }

    conexion.query(
        "SELECT id FROM usuarios WHERE email = ? AND id != ?",
        [email, id],
        (error, resultados)=>{
            if(error){
                console.log(error);
                return res.status(500).json({error: "Error del servidor" });
            }
            if(resultados.length>0){
                return res.status(409).json({error: "Ese email ya está en uso"});
            }

            const sql = password
                ? "UPDATE usuarios SET nombre = ?, email = ?, contraseña = ? WHERE id = ?"
                : "UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?";
            const valores = password ? [nombre, email, password, id] : [nombre, email, id];

            conexion.query(sql, valores, (error)=>{
                if(error){
                    console.log(error);
                    return res.status(500).json({ error: "Error al actualizar usuario" });
                }

                if(nombreArtistico !== undefined){

    conexion.query(
        "UPDATE artistas SET nombre_artistico = ?, descripcion = ?, link_musica = ? WHERE usuario_id = ?",
        [nombreArtistico, descripcion || "", linkMusica || null, id],
        (error)=>{
            if(error){
                console.log(error);
                return res.status(500).json({
                    error: "Error al actualizar perfil de artista"
                });
            }

            conexion.query(
                "SELECT id FROM artistas WHERE usuario_id = ?",
                [id],
                (error, resultadosArtista)=>{
                    if(error){
                        console.log(error);
                        return res.status(500).json({
                            error: "Error al buscar artista"
                        });
                    }

                    const artistaId = resultadosArtista[0].id;

                    conexion.query(
                        "DELETE FROM artista_generos WHERE artista_id = ?",
                        [artistaId],
                        (error)=>{
                            if(error){
                                console.log(error);
                                return res.status(500).json({
                                    error: "Error al actualizar géneros"
                                });
                            }

                            if(Array.isArray(generoIds)){
                                generoIds.forEach((generoId)=>{
                                    conexion.query(
                                        "INSERT INTO artista_generos (artista_id, genero_id) VALUES (?, ?)",
                                        [artistaId, generoId]
                                    );
                                });
                            }

                            conexion.query(
                                "DELETE FROM canciones WHERE artista_id = ?",
                                [artistaId],
                                (error)=>{
                                    if(error){
                                        console.log(error);
                                        return res.status(500).json({
                                            error: "Error al actualizar canciones"
                                        });
                                    }

                                    if(Array.isArray(canciones)){
                                        canciones
                                            .filter((titulo)=>titulo && titulo.trim() !== "")
                                            .forEach((titulo)=>{
                                                conexion.query(
                                                    "INSERT INTO canciones (artista_id, titulo) VALUES (?, ?)",
                                                    [artistaId, titulo]
                                                );
                                            });
                                    }
                                    res.json({mensaje: "Cuenta actualizada"});
                                    
                            });
                     });
                 });
            });
}else{
    res.json({mensaje: "Cuenta actualizada"});
}
    });
});
});

app.delete("/usuarios/:id", (req, res)=>{
    const {id}=req.params;

    conexion.query(
        "SELECT id FROM artistas WHERE usuario_id = ?",
        [id],
        (error, resultadosArtista)=>{
            if(error){
                console.log(error);
                return res.status(500).json({error: "Error del servidor"});
            }

            const esArtista=resultadosArtista.length>0;
            const artistaId=esArtista ? resultadosArtista[0].id : null;

        function borrarUsuario(){
                conexion.query("DELETE FROM seguidores WHERE usuario_id = ?", [id], ()=>{
                    conexion.query("DELETE FROM usuarios WHERE id = ?", [id], (error)=>{
                        if(error){
                            console.log(error);
                            return res.status(500).json({ error: "Error al eliminar la cuenta" });
                        }
                        res.json({mensaje: "Cuenta eliminada"});
                    });
                });
            }

    if(esArtista){
        conexion.query("DELETE FROM canciones WHERE artista_id = ?", [artistaId], ()=>{
            conexion.query("DELETE FROM seguidores WHERE artista_id = ?", [artistaId], ()=>{
                conexion.query("DELETE FROM artista_generos WHERE artista_id = ?", [artistaId], ()=>{
                    conexion.query("DELETE FROM artistas WHERE id = ?", [artistaId], (error)=>{
        if(error){
            console.log(error);
            return res.status(500).json({error: "Error al eliminar el perfil de artista"});
        }
        borrarUsuario();
        });
      });
    });
});
    }else{
      borrarUsuario();
    }});
});

app.listen(3000, "0.0.0.0",()=>{
    console.log("Servidor funcionando en el puerto 3000");
});