import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function Artista() {
  const [seguido, setSeguido] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.cover}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color="#FF2147" />
        </View>
      </View>

      <Text style={styles.name}>Luz de Neón</Text>
      <Text style={styles.genre}>INDIE / ALTERNATIVO</Text>

      <Text style={styles.description}>
        Artista independiente de Buenos Aires. Una propuesta que combina
        sonidos alternativos con una estética moderna.
      </Text>

      <TouchableOpacity
        style={[styles.follow, seguido && styles.followed]}
        onPress={() => setSeguido(!seguido)}
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

      <Text style={styles.section}>Canciones</Text>

      {["Cerca de acá", "Luces de ciudad", "Después de las doce"].map(
        (cancion, index) => (
          <View style={styles.song} key={cancion}>
            <Text style={styles.songNumber}>{index + 1}</Text>
            <Text style={styles.songName}>{cancion}</Text>
            <Ionicons name="play-circle-outline" size={27} color="#FF2147" />
          </View>
        )
      )}

      <Text style={styles.section}>Información</Text>
      <View style={styles.info}>
        <Text style={styles.infoText}>📍 Buenos Aires</Text>
        <Text style={styles.infoText}>🎵 Indie / Alternativo</Text>
        <Text style={styles.infoText}>👥 128 seguidores</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  content: { padding: 22, paddingTop: 45, paddingBottom: 100 },
  cover: {
    height: 210, borderRadius: 22, backgroundColor: "#18070A",
    alignItems: "center", justifyContent: "center", marginBottom: 22,
  },
  avatar: {
    width: 105, height: 105, borderRadius: 53, backgroundColor: "#220B0F",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#FF2147",
  },
  name: { color: "#FFFFFF", fontSize: 31, fontWeight: "900" },
  genre: { color: "#FF2147", fontSize: 11, fontWeight: "800", letterSpacing: 1.2, marginTop: 6 },
  description: { color: "#888888", fontSize: 14, lineHeight: 21, marginTop: 17 },
  follow: {
    backgroundColor: "#FF2147", borderRadius: 13, paddingVertical: 13,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, marginTop: 20,
  },
  followed: { backgroundColor: "#3A1118" },
  followText: { color: "#FFFFFF", fontWeight: "800" },
  section: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginTop: 30, marginBottom: 12 },
  song: {
    backgroundColor: "#121212", borderRadius: 14, padding: 13,
    marginBottom: 9, flexDirection: "row", alignItems: "center",
  },
  songNumber: { color: "#777777", width: 28, textAlign: "center" },
  songName: { color: "#FFFFFF", flex: 1, fontWeight: "600" },
  info: { backgroundColor: "#121212", borderRadius: 16, padding: 17, gap: 10 },
  infoText: { color: "#999999", fontSize: 13 },
});
