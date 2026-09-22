import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../config";


type Usuario={
  id: number;
  nombre: string;
  email: string;
  rol: "oyente" | "artista";
};

type AuthContextType={
  usuario: Usuario | null;
  cargando: boolean;
  login:(email: string, password: string)=>Promise<void>;
  registro:(
    nombre: string, 
    email: string, 
    password: string, 
    rol: string,
    datosArtista?:{nombreArtistico: string; descripcion: string; generoId: number; linkMusica: string; canciones: string[];      
    })=>Promise<void>;
  logout:()=>Promise<void>;
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
    datosArtista?:{nombreArtistico: string; descripcion: string; generoId: number, linkMusica: string; canciones: string[];}){
  
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
      generoId: datosArtista?.generoId,
      linkMusica: datosArtista?.linkMusica,
      canciones: datosArtista?.canciones,
    }),
  });

  const datos=await respuesta.json();

  if(!respuesta.ok){
    throw new Error(datos.error || "Error al registrarse");
  }
  await guardarSesion(datos.usuario);
}

  async function logout(){
    await AsyncStorage.removeItem("usuario");
    setUsuario(null);
  }

  return(
    <AuthContext.Provider value={{ usuario, cargando, login, registro, logout }}>
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