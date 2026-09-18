import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Perfil(){
  const{usuario, logout}=useAuth();

  async function cerrarSesion(){
    await logout();
  }

  return(
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
            {usuario?.rol==="artista" ? "Artista" : "Oyente"}
          </Text>
        </View>
      </View>

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