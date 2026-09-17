import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { API_URL } from "../../config";

const generos = ["Todos","Rock","Trap","Indie","Pop","Rap","Alternativo",];

export default function Explorar() {
  const[genero, setGenero]=useState("Todos");
  const[busqueda, setBusqueda]=useState("");
  const[artistas, setArtistas]=useState<any[]>([]);
  const[cargando, setCargando]= useState(true);

  useEffect(()=>{
    obtenerArtistas();
  }, []);

  const obtenerArtistas=async()=>{
    
    try{
      const respuesta=await fetch(`${API_URL}/artistas`);
      const datos=await respuesta.json();
      setArtistas(datos);

    }catch(error){ 
      console.log("Error al obtener artistas:");
      console.log(error);
    }
    setCargando(false);
  };


  const resultados=artistas.filter((artista)=>{

    const porGenero=genero==="Todos" || artista.genero.toLowerCase().includes(genero.toLowerCase());

    const porNombre=artista.nombre_artistico.toLowerCase().includes(busqueda.toLowerCase());
    return porGenero && porNombre;
  });

  return(

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}>

      <Text style={styles.title}>
        Explorar
      </Text>

      <Text style={styles.subtitle}>
        Encontrá artistas por género.</Text>

      <View style={styles.search}>

        <Ionicons
          name="search-outline"
          size={20}
          color="#777777"/>

        <TextInput
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar artista..."
          placeholderTextColor="#666666"
          style={styles.input}/>
      </View>

      <Text style={styles.label}>
        GÉNEROS
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}>

        {generos.map((item) => (

          <TouchableOpacity
            key={item}
            style={[
              styles.genre,
              genero === item && styles.genreActive,
            ]}
            onPress={() => setGenero(item)}>

            <Text
              style={[
                styles.genreText,
                genero === item &&
                  styles.genreTextActive,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>


      <Text style={styles.results}>
        Artistas</Text>
      {cargando && (
        <Text style={styles.message}>
          Cargando artistas...</Text>
      )}

      {!cargando && resultados.length === 0 && (

        <View style={styles.empty}>
          <Ionicons
            name="people-outline"
            size={40}
            color="#555555"/>

          <Text style={styles.message}>
            Todavía no hay artistas registrados.</Text>
          </View>
)}

      {!cargando && resultados.map((artista) => (

        <TouchableOpacity
          key={artista.id}
          style={styles.artistCard}
          onPress={() =>
            router.push(`/artista/${artista.id}`)
          }>

          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={24}
              color="#FF2147"
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>
              {artista.nombre_artistico}
            </Text>

            <Text style={styles.artistGenre}>
              {artista.genero}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#777777"
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}


const styles=StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#050505",
  },

  content: {
    padding: 22,
    paddingTop: 58,
    paddingBottom: 100,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
  },

  subtitle: {
    color: "#888888",
    marginTop: 6,
    marginBottom: 23,
  },

  search: {
    height: 52,
    backgroundColor: "#151515",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 25,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    marginLeft: 9,
  },

  label: {
    color: "#777777",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 11,
  },

  genre: {
    backgroundColor: "#171717",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },

  genreActive: {
    backgroundColor: "#FF2147",
  },

  genreText: {
    color: "#999999",
    fontWeight: "600",
  },

  genreTextActive: {
    color: "#FFFFFF",
  },

  results: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 28,
    marginBottom: 12,
  },

  artistCard: {
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 57,
    height: 57,
    borderRadius: 12,
    backgroundColor: "#21070C",
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
    marginLeft: 13,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  artistGenre: {
    color: "#888888",
    fontSize: 12,
    marginTop: 4,
  },

  empty: {
    alignItems: "center",
    marginTop: 40,
  },

  message: {
    color: "#777777",
    textAlign: "center",
    marginTop: 10,
  },
});