import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OnboardingBackground } from "@/components/onboarding-background";
import { PrimaryButton } from "@/components/primary-button";

const BG = require("../../assets/images/Archive-screen.png");

export default function OnboardingArchiveScreen() {
  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <OnboardingBackground source={BG} overlayOpacity={0.3} />
      <View className="z-10 flex-row items-center justify-between px-6 py-4">
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          className="rounded-full bg-surface-container-low/50 p-2"
        >
          <Ionicons name="arrow-back" size={24} color="#ffd700" />
        </Pressable>
        <Pressable
          onPress={() => router.push("/user-setup")}
          className="rounded-lg border border-primary-container/20 bg-surface-container-low/35 px-3 py-1.5 active:opacity-80"
        >
          <Text className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-primary-container">
            Skip
          </Text>
        </Pressable>
      </View>
      <ScrollView
        className="z-10 flex-1 px-8 pt-8"
        contentContainerClassName="pb-40"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="mb-10 items-center">
          {/* <View className="mb-8 h-40 w-40 items-center justify-center rounded-full border border-secondary/40 bg-surface-container-low">
            <Ionicons name="albums" size={48} color="#e9c176" />
          </View> */}
          <Text className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            Archive Forever
          </Text>
          <Text
            className="mt-2 text-center font-headline text-5xl font-extrabold leading-[0.95] tracking-tighter text-primary-container"
            style={{
              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 10,
            }}
          >
            A Digital Time Capsule
          </Text>
          <Text
            className="mt-4 max-w-lg text-center font-body text-lg leading-relaxed text-primary"
            style={{ opacity: 0.9 }}
          >
            Your graduation isn&apos;t just a day, it&apos;s a milestone.
            Archive it forever in your personal vault.
          </Text>
        </View>
      </ScrollView>
      <View className="z-10 border-t border-outline-variant/20 bg-surface/80 px-6 pb-6 pt-4">
        <View className="mb-4 flex-row items-center justify-center gap-2">
          <View className="h-1 w-8 rounded-full bg-surface-container-highest" />
          <View className="h-1 w-8 rounded-full bg-surface-container-highest" />
          <View className="h-1 w-12 rounded-full bg-primary-container" />
        </View>
        <PrimaryButton
          label="Start Archiving"
          onPress={() => router.push("/user-setup")}
          rightIcon="arrow-forward"
        />
      </View>
    </SafeAreaView>
  );
}
