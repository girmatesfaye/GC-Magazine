import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

import { isAuthExpiredErrorMessage } from "@/lib/auth-errors";
import { supabase } from "@/lib/supabase";

export default function MainLayout() {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authExpired, setAuthExpired] = useState(false);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return;
      }
      setAuthExpired(isAuthExpiredErrorMessage(error?.message));
      setIsAuthenticated(Boolean(data.session));
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) {
        return;
      }
      setIsAuthenticated(Boolean(session));
      if (!session && event !== "SIGNED_OUT") {
        setAuthExpired(true);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!ready) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href={authExpired ? "/login?reason=expired" : "/login"} />;
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
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="create-memory"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen name="memory/[id]" />
      </Stack>
    </>
  );
}
