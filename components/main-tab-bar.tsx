import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function MainTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isHome = pathname === "/home" || pathname.endsWith("/home");
  const isProfile = pathname === "/profile" || pathname.endsWith("/profile");
  const isCreate = pathname.includes("create-memory");

  const TabBtn = ({
    active,
    icon,
    onPress,
    filled,
  }: {
    active: boolean;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    filled?: boolean;
  }) => (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`p-3 ${active ? "rounded-full bg-primary-container/10" : ""}`}
    >
      <Ionicons
        name={icon}
        size={26}
        color={active ? "#ffd700" : "#d0c6ab"}
        style={filled && active ? undefined : { opacity: filled ? 1 : 0.9 }}
      />
    </Pressable>
  );

  return (
    <View
      className="absolute left-0 right-0 overflow-hidden rounded-t-3xl border-t border-outline-variant/10 bg-surface-container-low/95"
      style={{ bottom: 0, paddingBottom: Math.max(insets.bottom, 16) }}
    >
      {Platform.OS === "ios" ? (
        <BlurView intensity={48} tint="dark" className="absolute inset-0" />
      ) : null}
      <View className="flex-row items-center justify-around px-8 pt-3">
        <TabBtn
          active={isHome && !isCreate}
          icon="home-outline"
          onPress={() => router.push("/home")}
        />
        <TabBtn
          active={isCreate}
          icon="add-circle"
          filled
          onPress={() => router.push("/create-memory")}
        />
        <TabBtn
          active={isProfile && !isCreate}
          icon="person-outline"
          onPress={() => router.push("/profile")}
        />
      </View>
    </View>
  );
}
