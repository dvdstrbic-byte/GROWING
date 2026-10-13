import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { API_URL } from "../../config";

export default function Ranking(){
  const pathname=usePathname();
  const [canciones, setCanciones]=useState<any[]>([]);
  const [cargando, setCargando]=useState(true);

  useEffect(()=>{
    if(pathname!=="/ranking") return;
    obtenerRanking();
  }, [pathname]);

  const obtenerRanking=async()=>{
    try{
      const respuesta=await fetch(`${API_URL}/ranking`);
      const datos=await respuesta.json();

      if(Array.isArray(datos)){
        setCanciones(datos);
      }
    }catch(error){
      console.log("Error al obtener ranking:");
      console.log(error);
    }
    setCargando(false);
  };

  function escucharCancion(cancion: any){
    const url=cancion.url.startsWith("http") ? cancion.url : `https://${cancion.url}`;

    fetch(`${API_URL}/canciones/${cancion.id}/escucha`,{method: "POST"})
      .then(()=>obtenerRanking())
      .catch((error)=>console.log("Error al registrar escucha:", error));

    Linking.openURL(url);
  }

  return(
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}>

      <Text style={styles.title}>Ranking</Text>

      <Text style={styles.subtitle}>
        Las canciones más escuchadas.
      </Text>

      {cargando &&(
        <Text style={styles.message}>Cargando ranking...</Text>
      )}

      {!cargando && canciones.length===0 &&(
        <View style={styles.empty}>
          <Ionicons name="trophy-outline" size={40} color="#555555" />
          <Text style={styles.message}>
            Todavía no hay canciones con link.
          </Text>
        </View>
      )}

      {canciones.map((cancion, index)=>(
        <TouchableOpacity
          key={cancion.id}
          style={styles.song}
          onPress={()=>escucharCancion(cancion)}
        >
          <Text style={[styles.position, index<3 && styles.positionTop]}>
            {index + 1}
          </Text>

          <View style={styles.info}>
            <Text style={styles.songName}>{cancion.titulo}</Text>

            <TouchableOpacity
              onPress={()=>router.push(`/artista/${cancion.artista_id}`)}
            >
              <Text style={styles.artistName}>{cancion.nombre_artistico}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.plays}>
            <Text style={styles.playsNumber}>{cancion.reproducciones}</Text>
            <Text style={styles.playsLabel}>escuchas</Text>
          </View>

          <Ionicons name="play-circle-outline" size={27} color="#FF2147" />
        </TouchableOpacity>
      ))}

    </ScrollView>
  );
}

const styles=StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#050505",
  },
  content:{
    padding: 22,
    paddingTop: 58,
    paddingBottom: 100,
  },
  title:{
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
  },
  subtitle:{
    color: "#888888",
    marginTop: 6,
    marginBottom: 23,
  },
  message:{
    color: "#777777",
    textAlign: "center",
    marginTop: 10,
  },
  empty:{
    alignItems: "center",
    marginTop: 40,
  },
  song:{
    backgroundColor: "#121212",
    borderRadius: 14,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  position:{
    color: "#777777",
    fontSize: 16,
    fontWeight: "800",
    width: 26,
    textAlign: "center",
  },
  positionTop:{
    color: "#FF2147",
  },
  info:{
    flex: 1,
  },
  songName:{
    color: "#FFFFFF",
    fontWeight: "700",
  },
  artistName:{
    color: "#888888",
    fontSize: 12,
    marginTop: 3,
  },
  plays:{
    alignItems: "center",
  },
  playsNumber:{
    color: "#FFFFFF",
    fontWeight: "800",
  },
  playsLabel:{
    color: "#777777",
    fontSize: 10,
  },
});