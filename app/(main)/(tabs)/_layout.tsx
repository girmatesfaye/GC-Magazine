import { Tabs } from "expo-router";
import { View } from "react-native";

import { MainTabBar } from "@/components/main-tab-bar";

export default function MainTabsLayout() {
  return (
    <View className="flex-1 bg-surface" style={{ flex: 1 }}>
      <Tabs
        tabBar={() => null}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="profile" />
      </Tabs>
      <MainTabBar />
    </View>
  );
}
