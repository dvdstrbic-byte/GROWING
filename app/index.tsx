import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Inicio() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}>


      <View style={styles.header}>

        <Text style={styles.logo}>
          GROWING
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/perfil")}
        >
          <Ionicons
            name="person-circle-outline"
            size={34}
            color="#FFFFFF"
          />
        </TouchableOpacity>

      </View>

      <Text style={styles.welcome}>
        Descubrí lo nuevo.
      </Text>

      <Text style={styles.subtitle}>
        Artistas emergentes, en un solo lugar.
      </Text>

      <TouchableOpacity
        style={styles.mainCard}
        onPress={() => router.push("/artista/1")}
      >

        <View style={styles.imagePlaceholder}>

          <Ionicons
            name="musical-notes"
            size={45}
            color="#FF2147"/>
</View>

        <View style={styles.cardText}>

          <Text style={styles.small}>
            ARTISTA DESTACADO
          </Text>

          <Text style={styles.artist}>
            Luz de Neón
          </Text>

          <Text style={styles.genre}>
            Indie / Alternativo
          </Text>

        </View>

        <View style={styles.arrow}>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#FFFFFF"/>
</View>

      </TouchableOpacity>

      <View style={styles.titleRow}>

        <Text style={styles.sectionTitle}>
          Nuevos en la escena
        </Text>

        <Text style={styles.see}>
          Ver todos
        </Text>

      </View>

      <View style={styles.row}>

        <TouchableOpacity
          style={styles.smallCard}
          onPress={() => router.push("/artista/1")}>

          <View style={styles.smallImage}>

            <Ionicons
              name="person"
              size={30}
              color="#FF2147"
            />

          </View>

          <Text style={styles.cardName}>
            Sombra Blanca
          </Text>

          <Text style={styles.cardGenre}>
            Rock
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.smallCard}
          onPress={() => router.push("/artista/1")}>
          <View style={styles.smallImage}>

            <Ionicons
              name="person"
              size={30}
              color="#FF2147"/>

          </View>

          <Text style={styles.cardName}>
            Kairos
          </Text>

          <Text style={styles.cardGenre}>
            Trap
          </Text>

        </TouchableOpacity>

      </View>

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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 35,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 1,
  },

  welcome: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },

  subtitle: {
    color: "#888888",
    fontSize: 14,
    marginTop: 7,
    marginBottom: 25,
  },

  mainCard: {
    backgroundColor: "#151515",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#242424",
  },

  imagePlaceholder: {
    height: 190,
    backgroundColor: "#21070C",
    alignItems: "center",
    justifyContent: "center",
  },

  cardText: {
    padding: 17,
  },

  small: {
    color: "#FF2147",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  artist: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 5,
  },

  genre: {
    color: "#999999",
    fontSize: 13,
    marginTop: 4,
  },

  arrow: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#252525",
    alignItems: "center",
    justifyContent: "center",
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 13,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  see: {
    color: "#FF2147",
    fontSize: 12,
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  smallCard: {
    flex: 1,
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 10,
  },

  smallImage: {
    height: 115,
    borderRadius: 12,
    backgroundColor: "#211014",
    alignItems: "center",
    justifyContent: "center",
  },

  cardName: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginTop: 10,
  },

  cardGenre: {
    color: "#888888",
    fontSize: 12,
    marginTop: 3,
  },

}); 