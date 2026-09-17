import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";

function RutasProtegidas() {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!usuario}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="login" />
        <Stack.Screen name="registro" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RutasProtegidas />
    </AuthProvider>
  );
}