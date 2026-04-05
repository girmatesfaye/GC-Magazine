import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#131313" },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="create-memory"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="memory/[id]" />
    </Stack>
  );
}
