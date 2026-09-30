import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { API_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

export default function EditarPerfil(){
  const { usuario, actualizarUsuario } = useAuth();
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [password, setPassword] = useState("");
  const [nombreArtistico, setNombreArtistico] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [linkMusica, setLinkMusica] = useState("");
  const [generos, setGeneros] = useState<any[]>([]);
  const [generosSeleccionados, setGenerosSeleccionados] = useState<number[]>([]);
  const [canciones, setCanciones] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(usuario?.rol === "artista");

  useEffect(()=>{
    if(usuario?.rol === "artista"){
      obtenerMisDatos();
    }
  }, []);

  async function obtenerMisDatos(){
    try{
      const respuestaArtista=await fetch(
        `${API_URL}/artistas/usuario/${usuario!.id}`
      );

      const datosArtista=await respuestaArtista.json();

      if(respuestaArtista.ok){
        setNombreArtistico(datosArtista.nombre_artistico || "");
        setDescripcion(datosArtista.descripcion || "");
        setLinkMusica(datosArtista.link_musica || "");
      }

      const artistaId = datosArtista.id;

      const respuestaGeneros = await fetch(`${API_URL}/generos`);
      const datosGeneros = await respuestaGeneros.json();

      if (respuestaGeneros.ok) {
        setGeneros(datosGeneros);
      }

      const respuestaMisGeneros=await fetch(
        `${API_URL}/artistas/${artistaId}/generos`
      );

      const datosMisGeneros=await respuestaMisGeneros.json();

      if(respuestaMisGeneros.ok){
        setGenerosSeleccionados(
          datosMisGeneros.map((genero: any)=>genero.genero_id)
        );
      }

      const respuestaCanciones = await fetch(
        `${API_URL}/artistas/${artistaId}/canciones`
      );

      const datosCanciones=await respuestaCanciones.json();

      if(respuestaCanciones.ok){
        setCanciones(
          datosCanciones.map((cancion: any)=>cancion.titulo)
        );
      }

    }catch (error){
      console.log("Error al obtener datos del artista:");
      console.log(error);
    }

    setCargandoDatos(false);
  }

  function cambiarGenero(id: number){
    if(generosSeleccionados.includes(id)){
      setGenerosSeleccionados(
        generosSeleccionados.filter((generoId)=>generoId !== id)
      );
    }else{
      setGenerosSeleccionados([
        ...generosSeleccionados,
        id
      ]);
    }
  }

  function cambiarCancion(texto: string, indice: number) {
    const nuevasCanciones = [...canciones];
    nuevasCanciones[indice] = texto;
    setCanciones(nuevasCanciones);
  }

  function agregarCancion(){
    setCanciones([
      ...canciones,
      ""
    ]);
  }

  function eliminarCancion(indice: number){
    const nuevasCanciones = canciones.filter(
      (_, index)=>index !== indice
    );

    setCanciones(nuevasCanciones);
  }

  async function guardarCambios(){
    if(!nombre || !email){
      Alert.alert(
        "Faltan datos",
        "Completá nombre y email."
      );
      return;
    }

    if (!email.includes("@")){
      Alert.alert(
        "Email inválido",
        "El email tiene que contener un @."
      );
      return;
    }

    if (password && password.length !== 4){
      Alert.alert(
        "Contraseña inválida",
        "Si la cambiás, tiene que tener exactamente 4 caracteres."
      );
      return;
    }

    if (usuario?.rol === "artista" && generosSeleccionados.length === 0) {
      Alert.alert(
        "Falta un género",
        "Seleccioná al menos un género."
      );
      return;
    }

    try{
      setCargando(true);

      await actualizarUsuario({
        nombre,
        email,
        password: password || undefined,

        ...(usuario?.rol === "artista" &&{
          nombreArtistico,
          descripcion,
          linkMusica,
          generoIds: generosSeleccionados,
          canciones: canciones.filter(
            (cancion) => cancion.trim() !== ""
          ),
        }),
      });

      Alert.alert(
        "Listo",
        "Tu cuenta fue actualizada."
      );

      router.back();

    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message
      );
    } finally {
      setCargando(false);
    }
  }

  if (cargandoDatos) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >

        <Text style={styles.title}>
          Editar perfil
        </Text>

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
          placeholder="Nueva contraseña"
          placeholderTextColor="#666666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          maxLength={4}
        />

        {usuario?.rol === "artista" && (
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
              placeholder="Descripción"
              placeholderTextColor="#666666"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              numberOfLines={3}
            />

            <TextInput
              style={styles.input}
              placeholder="Link a Spotify, YouTube, etc."
              placeholderTextColor="#666666"
              value={linkMusica}
              onChangeText={setLinkMusica}
              autoCapitalize="none"
            />

            <Text style={styles.sectionTitle}>
              Géneros
            </Text>

            <View style={styles.generosContainer}>
              {generos.map((genero) => (
                <TouchableOpacity
                  key={genero.id}
                  style={[
                    styles.genero,
                    generosSeleccionados.includes(genero.id) &&
                    styles.generoSeleccionado
                  ]}
                  onPress={() => cambiarGenero(genero.id)}
                >
                  <Text
                    style={[
                      styles.generoTexto,
                      generosSeleccionados.includes(genero.id) &&
                      styles.generoTextoSeleccionado
                    ]}
                  >
                    {genero.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>
              Canciones sugeridas
            </Text>

            {canciones.map((cancion, indice) => (
              <View
                key={indice}
                style={styles.cancionContainer}
              >

                <TextInput
                  style={styles.cancionInput}
                  placeholder={`Canción ${indice + 1}`}
                  placeholderTextColor="#666666"
                  value={cancion}
                  onChangeText={(texto) =>
                    cambiarCancion(texto, indice)
                  }
                />

                <TouchableOpacity
                  onPress={() => eliminarCancion(indice)}
                >
                  <Text style={styles.eliminarCancion}>
                    X
                  </Text>
                </TouchableOpacity>

              </View>
            ))}

            <TouchableOpacity
              style={styles.agregarButton}
              onPress={agregarCancion}
            >
              <Text style={styles.agregarTexto}>
                + Agregar canción
              </Text>
            </TouchableOpacity>

          </>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={guardarCambios}
          disabled={cargando}
        >
          <Text style={styles.buttonText}>
            {cargando
              ? "Guardando..."
              : "Guardar cambios"
            }
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={styles.link}>
            Cancelar
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#050505"
  },

  scrollContent: {
    padding: 28,
    paddingTop: 60,
    paddingBottom: 60
  },

  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 26,
    textAlign: "center"
  },

  input: {
    backgroundColor: "#151515",
    borderRadius: 14,
    padding: 15,
    color: "#FFFFFF",
    marginBottom: 14
  },

  inputMultiline: {
    height: 80,
    textAlignVertical: "top"
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 12
  },

  generosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10
  },

  genero: {
    backgroundColor: "#151515",
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 14
  },

  generoSeleccionado: {
    backgroundColor: "#FF2147"
  },

  generoTexto: {
    color: "#AAAAAA"
  },

  generoTextoSeleccionado: {
    color: "#FFFFFF",
    fontWeight: "700"
  },

  cancionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },

  cancionInput: {
    flex: 1,
    backgroundColor: "#151515",
    borderRadius: 14,
    padding: 15,
    color: "#FFFFFF"
  },

  eliminarCancion: {
    color: "#FF2147",
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 12
  },

  agregarButton: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    marginBottom: 20
  },

  agregarTexto: {
    color: "#FF2147",
    fontWeight: "700"
  },

  button: {
    backgroundColor: "#FF2147",
    borderRadius: 14,
    padding: 15,
    alignItems: "center"
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800"
  },

  link: {
    color: "#888888",
    textAlign: "center",
    marginTop: 18
  }

});