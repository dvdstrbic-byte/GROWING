import { useState } from "react";

import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";


const generos = [
  "Todos",
  "Rock",
  "Trap",
  "Indie",
  "Pop",
  "Rap",
  "Alternativo",
];


const artistas = [
  {
    id: "1",
    nombre: "Luz de Neón",
    genero: "Indie / Alternativo",
  },

  {
    id: "2",
    nombre: "Sombra Blanca",
    genero: "Rock",
  },

  {
    id: "3",
    nombre: "Kairos",
    genero: "Trap",
  },

  {
    id: "4",
    nombre: "Marea Alta",
    genero: "Indie",
  },
];


export default function Explorar() {

  const [genero, setGenero] = useState("Todos");

  const [busqueda, setBusqueda] = useState("");


  const resultados = artistas.filter((artista) => {

    const porGenero =
      genero === "Todos" ||
      artista.genero
        .toLowerCase()
        .includes(genero.toLowerCase());


    const porNombre =
      artista.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());


    return porGenero && porNombre;

  });


  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <Text style={styles.title}>
        Explorar
      </Text>

      <Text style={styles.subtitle}>
        Encontrá artistas por género.
      </Text>



      <View style={styles.search}>

        <Ionicons
          name="search-outline"
          size={20}
          color="#777777" />

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
        Artistas
      </Text>


      {resultados.map((artista) => (

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
              color="#FF2147"/>

          </View>


          <View style={styles.info}>

            <Text style={styles.name}>
              {artista.nombre}
            </Text>

            <Text style={styles.artistGenre}>
              {artista.genero}
            </Text>

          </View>


          <Ionicons
            name="chevron-forward"
            size={20}
            color="#777777"/>

        </TouchableOpacity>

      ))}

    </ScrollView>

  );
}


const styles = StyleSheet.create({

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

});