import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { API_URL } from "../../../config";

export default function Artista() {
  const { id } = useLocalSearchParams();

  const [seguido, setSeguido] = useState(false);
  const [artista, setArtista] = useState<any>(null);
  const [canciones, setCanciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerArtista();
    obtenerCanciones();
  }, [id]);

  const obtenerArtista = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/artistas/${id}`);
      const datos = await respuesta.json();

      if (respuesta.ok) {
        setArtista(datos);
      }
    } catch (error) {
      console.log("Error al obtener artista:");
      console.log(error);
    }
    setCargando(false);
  };

  const obtenerCanciones = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/artistas/${id}/canciones`);
      const datos = await respuesta.json();

      if (Array.isArray(datos)) {
        setCanciones(datos);
      }
    } catch (error) {
      console.log("Error al obtener canciones:");
      console.log(error);
    }
  };

  if (cargando) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Cargando artista...</Text>
      </View>
    );
  }

  if (!artista) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No se encontró el artista.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.cover}>
        <Ionicons name="musical-notes" size={50} color="#FF2147" />
      </View>

      <Text style={styles.name}>
        {artista.nombre_artistico}
      </Text>

      <Text style={styles.genre}>
        {artista.genero?.toUpperCase() || "SIN GÉNERO"}
      </Text>

      {artista.descripcion ? (
        <Text style={styles.description}>
          {artista.descripcion}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.follow,
          seguido && styles.followed,
        ]}
        onPress={()=>setSeguido(!seguido)}
      >

        <Ionicons
          name={seguido ? "checkmark" : "heart-outline"}
          size={18}
          color="#FFFFFF"
        />

        <Text style={styles.followText}>
          {seguido ? "Siguiendo" : "Seguir artista"}
        </Text>

      </TouchableOpacity>

      {artista.link_musica ? (
      <TouchableOpacity
      style={styles.escuchar}
      onPress={()=>Linking.openURL(artista.link_musica)}
      >
    <Ionicons name="musical-note" size={18} color="#FFFFFF" />
    <Text style={styles.escucharText}>Escuchar música</Text>
  </TouchableOpacity>
    ) : null}

      {canciones.length > 0 && (
        <>
          <Text style={styles.section}>
            Canciones
          </Text>

          {canciones.map((cancion, index)=>(
            <View style={styles.song} key={cancion.id}>

              <Text style={styles.songNumber}>
                {index + 1}
              </Text>

              <Text style={styles.songName}>
                {cancion.titulo}
              </Text>

              <Ionicons
                name="play-circle-outline"
                size={27}
                color="#FF2147"
              />

            </View>
          ))}
        </>
      )}

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
    paddingTop: 45,
    paddingBottom: 100,
  },

  message:{
    color: "#777777",
    textAlign: "center",
    marginTop: 100,
  },

  cover:{
    height: 210,
    borderRadius: 22,
    backgroundColor: "#18070A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  name:{
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
  },

  genre:{
    color: "#FF2147",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: 6,
  },

  description:{
    color: "#888888",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 17,
  },

  follow:{
    backgroundColor: "#FF2147",
    borderRadius: 13,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },

  followed:{
    backgroundColor: "#3A1118",
  },

  followText:{
    color: "#FFFFFF",
    fontWeight: "800",
  },

  escuchar: {
  backgroundColor: "#171717",
  borderRadius: 13,
  paddingVertical: 13,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  marginTop: 10,
  borderWidth: 1,
  borderColor: "#333333",
},

escucharText: {
  color: "#FFFFFF",
  fontWeight: "700",
},

  section:{
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 30,
    marginBottom: 12,
  },

  song:{
    backgroundColor: "#121212",
    borderRadius: 14,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  songNumber:{
    color: "#777777",
    width: 28,
    textAlign: "center",
  },

  songName:{
    color: "#FFFFFF",
    flex: 1,
    fontWeight: "600",
  },

});