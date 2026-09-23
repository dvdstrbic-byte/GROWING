import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { API_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

export default function Perfil(){
  const {usuario, logout}=useAuth();
  const [seguidos, setSeguidos]=useState<any[]>([]);
  const [misSeguidores, setMisSeguidores]=useState<any[]>([]);
  const [cantidadSeguidores, setCantidadSeguidores]=useState(0);
  

  const pathname=usePathname();

  useEffect(()=>{
  if(pathname!=="/perfil") return;

  if(usuario?.rol==="oyente"){
    obtenerSeguidos();
  }
  if(usuario?.rol==="artista"){
    obtenerMisSeguidores();
  }
},[pathname, usuario]);

  const obtenerSeguidos=async()=>{
    try{
      const respuesta=await fetch(`${API_URL}/usuarios/${usuario!.id}/seguidos`);
      const datos=await respuesta.json();

      if(Array.isArray(datos)){
        setSeguidos(datos);
      }
    }catch(error){
      console.log("Error al obtener seguidos:");
      console.log(error);
    }
  };

  const obtenerMisSeguidores=async()=>{
    try{
      const respuestaArtista=await fetch(`${API_URL}/artistas/usuario/${usuario!.id}`);
      const datosArtista=await respuestaArtista.json();

      if(!respuestaArtista.ok)return;

      setCantidadSeguidores(datosArtista.cantidad_seguidores);

      const respuestaSeguidores=await fetch(`${API_URL}/artistas/${datosArtista.id}/seguidores-lista`);
      const datosSeguidores=await respuestaSeguidores.json();

      if(Array.isArray(datosSeguidores)){
        setMisSeguidores(datosSeguidores);
      }
    } catch(error){
      console.log("Error al obtener mis seguidores:");
      console.log(error);
    }
  };

  async function cerrarSesion(){
    await logout();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi perfil</Text>

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>
            {usuario?.nombre.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{usuario?.nombre}</Text>
        <Text style={styles.email}>{usuario?.email}</Text>

        <View style={styles.tag}>
          <Text style={styles.tagText}>
            {usuario?.rol === "artista" ? "Artista" : "Oyente"}
          </Text>
        </View>

        {usuario?.rol==="artista" && (
          <Text style={styles.seguidoresCount}>
            {cantidadSeguidores} seguidores
          </Text>
        )}
      </View>

      {usuario?.rol==="oyente" && (
        <>
          <Text style={styles.section}>Artistas que seguís</Text>

          {seguidos.length===0 && (
            <Text style={styles.empty}>Todavía no seguís a ningún artista.</Text>
          )}

          {seguidos.map((artista) => (
            <TouchableOpacity
              key={artista.id}
              style={styles.artistItem}
              onPress={() => router.push(`/artista/${artista.id}`)}
            >
              <Ionicons name="person-circle-outline" size={30} color="#FF2147" />
              <Text style={styles.artistName}>{artista.nombre_artistico}</Text>
              <Ionicons name="chevron-forward" size={18} color="#777777" />
            </TouchableOpacity>
          ))}
        </>
      )}

      {usuario?.rol==="artista" && (
        <>
          <Text style={styles.section}>Tus seguidores</Text>

          {misSeguidores.length===0 && (
            <Text style={styles.empty}>Todavía no tenés seguidores.</Text>
          )}

          {misSeguidores.map((seguidor)=>(
            <View key={seguidor.id} style={styles.artistItem}>
              <Ionicons name="person-circle-outline" size={30} color="#FF2147" />
              <Text style={styles.artistName}>{seguidor.nombre}</Text>
            </View>
          ))}
        </>
      )}

      <TouchableOpacity style={styles.option} onPress={cerrarSesion}>
        <Ionicons name="log-out-outline" size={22} color="#FF2147" />
        <Text style={styles.optionText}>Cerrar sesión</Text>
        <Ionicons name="chevron-forward" size={18} color="#777777" />
      </TouchableOpacity>
    </View>
  );
}

const styles=StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#050505",
    padding: 22,
    paddingTop: 58,
  },
  title:{
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
  },
  profile:{
    alignItems: "center",
    marginTop: 30,
  },
  avatar:{
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#21070C",
    borderWidth: 1,
    borderColor: "#FF2147",
    alignItems: "center",
    justifyContent: "center",
  },
  initials:{
    color: "#FF2147",
    fontSize: 30,
    fontWeight: "900",
  },
  name:{
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 13,
  },
  email:{
    color: "#777777",
    marginTop: 4,
  },
  tag:{
    backgroundColor: "#171717",
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginTop: 16,
  },
  tagText:{
    color: "#BBBBBB",
    fontWeight: "600",
  },
  
  seguidoresCount:{
    color: "#777777",
    fontSize: 13,
    marginTop: 10,
  },
  section:{
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 30,
    marginBottom: 12,
  },
  empty:{
    color: "#777777",
    fontSize: 13,
  },
  artistItem:{
    backgroundColor: "#121212",
    borderRadius: 14,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  artistName:{
    color: "#FFFFFF",
    flex: 1,
    fontWeight: "600",
  },
  option:{
    backgroundColor: "#121212",
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 35,
  },
  optionText:{
    color: "#FFFFFF",
    flex: 1,
    marginLeft: 12,
    fontWeight: "600",
  },
});