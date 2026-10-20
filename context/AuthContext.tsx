import AsyncStorage from "@react-native-async-storage/async-storage";
import { File } from "expo-file-system";
import { fetch as fetchExpo } from "expo/fetch";
import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../config";


type Usuario={
  id: number;
  nombre: string;
  email: string;
  foto?: string | null;
  rol: "oyente" | "artista";
};

export type Cancion={
  titulo: string;
  url?: string;
};

type DatosArtista={
  nombreArtistico: string;
  descripcion: string;
  generoIds: number[];
  linkMusica: string;
  canciones: Cancion[];
};

type DatosEdicion={
  nombre: string;
  email: string;
  password?: string;
  nombreArtistico?: string;
  descripcion?: string;
  linkMusica?: string;
  generoIds?: number[];
  canciones?: (string | Cancion)[];
};

type AuthContextType={
  usuario: Usuario | null;
  cargando: boolean;
  login: (email: string, password: string)=>Promise<void>;
  registro: (
    nombre: string,
    email: string,
    password: string,
    rol: string,
    datosArtista?: DatosArtista,
    fotoUri?: string | null
  )=>Promise<void>;
  cambiarFoto: (uri: string)=>Promise<void>;
  actualizarUsuario: (datos: DatosEdicion)=>Promise<void>;
  eliminarCuenta:()=> Promise<void>;
  logout: ()=>Promise<void>;
};

const AuthContext=createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [usuario, setUsuario]=useState<Usuario | null>(null);
  const [cargando, setCargando]=useState(true);

  useEffect(()=>{
    async function cargarSesion(){
      try{
        const usuarioGuardado=await AsyncStorage.getItem("usuario");
        if(usuarioGuardado){
          setUsuario(JSON.parse(usuarioGuardado));
        }
      }catch(error){
        console.log("Error al cargar sesión:", error);
      }finally{
        setCargando(false);
      }
    }

    cargarSesion();
  }, []);

  async function guardarSesion(usuario: Usuario){
    await AsyncStorage.setItem("usuario", JSON.stringify(usuario));
    setUsuario(usuario);
  }

  async function login(email: string, password: string) {
    const respuesta=await fetch(`${API_URL}/login`, {
      method:"POST",
      headers:{ "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const datos=await respuesta.json();

    if(!respuesta.ok){
      throw new Error(datos.error || "Error al iniciar sesión");
    }

    await guardarSesion(datos.usuario);
  }
  
   async function registro(
    nombre: string,
    email: string,
    password: string,
    rol: string,
    datosArtista?: DatosArtista,
    fotoUri?: string | null
  ){
  
  const respuesta=await fetch(`${API_URL}/registro`,{
    method: "POST",
    headers:{ "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      email,
      password,
      rol,
      nombreArtistico: datosArtista?.nombreArtistico,
      descripcion: datosArtista?.descripcion,
      generoIds: datosArtista?.generoIds,
      linkMusica: datosArtista?.linkMusica,
      canciones: datosArtista?.canciones,
    }),
  });

  const datos=await respuesta.json();

  if(!respuesta.ok){
    throw new Error(datos.error || "Error al registrarse");
  }
  let usuarioNuevo: Usuario=datos.usuario;

if(fotoUri){
  try{
    const ruta=await subirFoto(usuarioNuevo.id, fotoUri);
    usuarioNuevo={...usuarioNuevo, foto: ruta};
  }catch(error){
    console.log("Error al subir la foto:", error);
  }
}

await guardarSesion(usuarioNuevo);
}

    async function subirFoto(usuarioId: number, uri: string){
    const formulario=new FormData();
    formulario.append("foto", new File(uri));

    const respuesta=await fetchExpo(`${API_URL}/usuarios/${usuarioId}/foto`,{
      method: "POST",
      body: formulario,
    });

    const datos=await respuesta.json();

    if(!respuesta.ok){
      throw new Error(datos.error || "Error al subir la foto");
    }

    return datos.foto as string;
  }

  async function cambiarFoto(uri: string){
    const ruta=await subirFoto(usuario!.id, uri);
    await guardarSesion({...usuario!, foto: ruta});
  }

async function actualizarUsuario(datos: DatosEdicion) {
    const respuesta = await fetch(`${API_URL}/usuarios/${usuario!.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const resultado=await respuesta.json();

    if(!respuesta.ok){
      throw new Error(resultado.error || "Error al actualizar la cuenta");
    }

    await guardarSesion({ ...usuario!, nombre: datos.nombre, email: datos.email });
  }

  async function eliminarCuenta(){
    const respuesta=await fetch(`${API_URL}/usuarios/${usuario!.id}`,{
      method: "DELETE",
    });

    if(!respuesta.ok){
      const resultado = await respuesta.json();
      throw new Error(resultado.error || "Error al eliminar la cuenta");
    }
    await logout();
  }

  async function logout(){
    await AsyncStorage.removeItem("usuario");
    setUsuario(null);
  }

 return (
     <AuthContext.Provider
       value={{ usuario, cargando, login, registro, cambiarFoto, actualizarUsuario, eliminarCuenta, logout }}
     >
       {children}
     </AuthContext.Provider>
   );
 }

export function useAuth(){
  const context=useContext(AuthContext);
  if(!context){
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}