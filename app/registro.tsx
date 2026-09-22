import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

export default function Registro(){
  const{ registro }=useAuth();

  const[nombre, setNombre]=useState("");
  const[email, setEmail]=useState("");
  const[password, setPassword]=useState("");
  const[rol, setRol]=useState<"oyente" | "artista">("oyente");
  const[cargando, setCargando]=useState(false);

  const[nombreArtistico, setNombreArtistico]=useState("");
  const[descripcion, setDescripcion]=useState("");
  const[generos, setGeneros]=useState<any[]>([]);
  const[generoId, setGeneroId]=useState<number | null>(null);
  const [linkMusica, setLinkMusica] = useState("");

  useEffect(()=>{
    obtenerGeneros();
  }, []);

  const obtenerGeneros=async()=>{
    try{
      const respuesta=await fetch(`${API_URL}/generos`);
      const datos=await respuesta.json();

      if(Array.isArray(datos)){
        setGeneros(datos);
      }
    }catch (error){
      console.log("Error al obtener generos:");
      console.log(error);
    }
  };

  async function crearCuenta(){
    if(!nombre || !email || !password){
      Alert.alert("Faltan datos", "Completá todos los campos.");
      return;
    }

    if(!email.includes("@")){
      Alert.alert("Email inválido", "El email tiene que contener un @.");
      return;
    }

    if(password.length !== 4){
      Alert.alert("Contraseña inválida", "La contraseña tiene que tener exactamente 4 caracteres.");
      return;
    }

    if(rol==="artista" && (!nombreArtistico || !generoId)){
      Alert.alert("Faltan datos", "Completá tu nombre artístico y elegí un género.");
      return;
    }

    try{
      setCargando(true);

      if(rol==="artista"){
        await registro(nombre, email, password, rol,{
          nombreArtistico,
          descripcion,
          generoId: generoId!,
          linkMusica,
        });
      }else{
        await registro(nombre, email, password, rol);
      }
    }catch(error: any){
      Alert.alert("Error", error.message);
    }finally{
      setCargando(false);
    }
  }

  return(
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        {rol==="artista" &&(
          <>
            <TextInput
              style={styles.input}
              placeholder="Nombre artístico"
              placeholderTextColor="#666666"
              value={nombreArtistico}
              onChangeText={setNombreArtistico}
            />

            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Contanos sobre vos y tu música..."
              placeholderTextColor="#666666"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>GÉNERO</Text>

            <View style={styles.generoRow}>
              {generos.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  style={[
                    styles.generoChip,
                    generoId===g.id && styles.generoChipActive,
                  ]}
                  onPress={()=>setGeneroId(g.id)}
                >
                  <Text
                    style={[
                      styles.generoChipText,
                      generoId===g.id && styles.generoChipTextActive,
                    ]}
                  >
                    {g.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

          <TextInput
            style={styles.input}
            placeholder="Link a Spotify, YouTube, etc. (opcional)"
            placeholderTextColor="#666666"
            value={linkMusica}
            onChangeText={setLinkMusica}
            autoCapitalize="none"
            />

            {generos.length===0 &&(
              <Text style={styles.avisoGeneros}>
                Todavía no hay géneros cargados en la base de datos.
              </Text>
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={crearCuenta}
          disabled={cargando}
        >
          <Text style={styles.buttonText}>
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>router.back()}>
          <Text style={styles.link}>Ya tengo cuenta</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles=StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#050505",
  },
  scrollContent:{
    justifyContent: "center",
    padding: 28,
    paddingTop: 60,
    paddingBottom: 60,
  },
  title:{
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 26,
    textAlign: "center",
  },
  input:{
    backgroundColor: "#151515",
    borderRadius: 14,
    padding: 15,
    color: "#FFFFFF",
    marginBottom: 14,
  },
  inputMultiline:{
    height: 80,
    textAlignVertical: "top",
  },
  label:{
    color: "#777777",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 10,
  },
  rolRow:{
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  rolButton:{
    flex: 1,
    backgroundColor: "#151515",
    borderRadius: 14,
    padding: 13,
    alignItems: "center",
  },
  rolActive:{
    backgroundColor: "#FF2147",
  },
  rolText:{
    color: "#999999",
    fontWeight: "700",
  },
  rolTextActive:{
    color: "#FFFFFF",
  },
  generoRow:{
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  generoChip:{
    backgroundColor: "#171717",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  generoChipActive:{
    backgroundColor: "#FF2147",
  },
  generoChipText:{
    color: "#999999",
    fontWeight: "600",
  },
  generoChipTextActive:{
    color: "#FFFFFF",
  },
  avisoGeneros:{
    color: "#777777",
    fontSize: 12,
    marginBottom: 20,
  },
  button:{
    backgroundColor: "#FF2147",
    borderRadius: 14,
    padding: 15,
    alignItems: "center",
  },
  buttonText:{
    color: "#FFFFFF",
    fontWeight: "800",
  },
  link:{
    color: "#888888",
    textAlign: "center",
    marginTop: 18,
  },
});