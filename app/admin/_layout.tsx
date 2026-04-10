import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

import { fetchCurrentProfile } from "@/lib/profiles";

export default function AdminLayout() {
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      const profile = await fetchCurrentProfile();

      if (!isMounted) {
        return;
      }

      setIsAdmin(profile?.is_admin ?? false);
      setReady(true);
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!ready) {
    return null;
  }

  if (!isAdmin) {
    return <Redirect href="/login?reason=expired" />;
  }

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          animationMatchesGesture: true,
          contentStyle: { backgroundColor: "#131313" },
        }}
      />
    </>
  );
}
