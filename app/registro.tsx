import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
  const { registro } = useAuth();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<"oyente" | "artista">("oyente");
  const [cargando, setCargando] = useState(false);

  async function crearCuenta() {
    if (!nombre || !email || !password) {
      Alert.alert("Faltan datos", "Completá todos los campos.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Email inválido", "El email tiene que contener un @.");
      return;
    }

    if (password.length !== 4) {
      Alert.alert("Contraseña inválida", "La contraseña tiene que tener exactamente 4 caracteres.");
      return;
    }

    try {
      setCargando(true);
      await registro(nombre, email, password, rol);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#666666"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña (4 caracteres)"
        placeholderTextColor="#666666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        maxLength={4}
      />

      {/* SELECTOR DE ROL */}
      <Text style={styles.label}>SOY...</Text>

      <View style={styles.rolRow}>
        <TouchableOpacity
          style={[styles.rolButton, rol === "oyente" && styles.rolActive]}
          onPress={() => setRol("oyente")}
        >
          <Text style={[styles.rolText, rol === "oyente" && styles.rolTextActive]}>
            Oyente
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rolButton, rol === "artista" && styles.rolActive]}
          onPress={() => setRol("artista")}
        >
          <Text style={[styles.rolText, rol === "artista" && styles.rolTextActive]}>
            Artista
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={crearCuenta}
        disabled={cargando}
      >
        <Text style={styles.buttonText}>
          {cargando ? "Creando cuenta..." : "Crear cuenta"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Ya tengo cuenta</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    justifyContent: "center",
    padding: 28,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 26,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#151515",
    borderRadius: 14,
    padding: 15,
    color: "#FFFFFF",
    marginBottom: 14,
  },
  label: {
    color: "#777777",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 10,
  },
  rolRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  rolButton: {
    flex: 1,
    backgroundColor: "#151515",
    borderRadius: 14,
    padding: 13,
    alignItems: "center",
  },
  rolActive: {
    backgroundColor: "#FF2147",
  },
  rolText: {
    color: "#999999",
    fontWeight: "700",
  },
  rolTextActive: {
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#FF2147",
    borderRadius: 14,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  link: {
    color: "#888888",
    textAlign: "center",
    marginTop: 18,
  },
});