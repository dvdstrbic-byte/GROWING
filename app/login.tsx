import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion() {
    if (!email || !password) {
      Alert.alert("Faltan datos", "Completá email y contraseña.");
      return;
    }

    try {
      setCargando(true);
      await login(email, password);
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
      <Text style={styles.logo}>GROWING</Text>
      <Text style={styles.title}>Iniciar sesión</Text>

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
        placeholder="Contraseña"
        placeholderTextColor="#666666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={iniciarSesion}
        disabled={cargando}
      >
        <Text style={styles.buttonText}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/registro")}>
        <Text style={styles.link}>
          ¿No tenés cuenta? Registrate
        </Text>
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
  logo: {
    color: "#FF2147",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#151515",
    borderRadius: 14,
    padding: 15,
    color: "#FFFFFF",
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#FF2147",
    borderRadius: 14,
    padding: 15,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  link: {
    color: "#888888",
    textAlign: "center",
    marginTop: 20,
  },
});