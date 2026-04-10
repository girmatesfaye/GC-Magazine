import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function OnboardingLayout() {
  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Stack
        screenOptions={{
          headerShown: false,
          fullScreenGestureEnabled: true,
          animationMatchesGesture: true,
          gestureEnabled: true,
          contentStyle: { backgroundColor: "#131313" },
        }}
      />
    </>
  );
}
