import { StyleSheet, Text, TouchableOpacity, View, } from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function Perfil() {
return (

  <View style={styles.container}>

      <Text style={styles.title}>
        Mi perfil
      </Text>

      <View style={styles.profile}>

        <View style={styles.avatar}>

          <Text style={styles.initials}>
            U
          </Text>

        </View>


        <Text style={styles.name}>
          usuario123
        </Text>


        <Text style={styles.email}>
          usuario@growing.com
        </Text>


        <TouchableOpacity style={styles.button}>

          <Text style={styles.buttonText}>
            Editar perfil
          </Text>

        </TouchableOpacity>

      </View>

      <View style={styles.stats}>

        <View>

          <Text style={styles.number}>
            5
          </Text>

          <Text style={styles.statText}>
            artistas guardados
          </Text>

        </View>


        <View>

          <Text style={styles.number}>
            0
          </Text>

          <Text style={styles.statText}>
            seguidores
          </Text>

        </View>

      </View>

      <Text style={styles.section}>
        Mis géneros
      </Text>


      <View style={styles.genres}>

        <View style={styles.tag}>
          <Text style={styles.tagText}>
            Rock
          </Text>
        </View>

        <View style={styles.tag}>
          <Text style={styles.tagText}>
            Indie
          </Text>
        </View>

        <View style={styles.tag}>
          <Text style={styles.tagText}>
            Trap
          </Text>
        </View>

      </View>

      <TouchableOpacity style={styles.option}>

        <Ionicons
          name="settings-outline"
          size={22}
          color="#FF2147"
        />

        <Text style={styles.optionText}>
          Configuración
        </Text>

        <Ionicons
          name="chevron-forward"
          size={18}
          color="#777777"
        />

      </TouchableOpacity>

    </View>

  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#050505",
    padding: 22,
    paddingTop: 58,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
  },

  profile: {
    alignItems: "center",
    marginTop: 30,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#21070C",
    borderWidth: 1,
    borderColor: "#FF2147",
    alignItems: "center",
    justifyContent: "center",
  },

  initials: {
    color: "#FF2147",
    fontSize: 30,
    fontWeight: "900",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 13,
  },

  email: {
    color: "#777777",
    marginTop: 4,
  },

  button: {
    borderWidth: 1,
    borderColor: "#444444",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 14,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#222222",
    paddingVertical: 18,
    marginTop: 28,
  },

  number: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
  },

  statText: {
    color: "#777777",
    fontSize: 11,
    marginTop: 4,
  },

  section: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 28,
    marginBottom: 12,
  },

  genres: {
    flexDirection: "row",
    gap: 8,
  },

  tag: {
    backgroundColor: "#171717",
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },

  tagText: {
    color: "#BBBBBB",
    fontWeight: "600",
  },

  option: {
    backgroundColor: "#121212",
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },

  optionText: {
    color: "#FFFFFF",
    flex: 1,
    marginLeft: 12,
    fontWeight: "600",
  },

});