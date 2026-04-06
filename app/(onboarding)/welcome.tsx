import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";

const HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDGllpV4XnyLBcKm5T0IJ_EOw4fuOG9eq3azlpT9s4655UC7fJUYGl6Gid-VIeUbCJwmrWQQGPiXYbny_7GYssiLETG7JLp6ZNPi79vh6y_gHy5naYWIemCfxWg8_6a8Gi-_09VIF9kpt7UCfhYQTLGUCl3qLEpef3nWgnaP4_Fue6tuPjt4KIZxW6B5oC8BbShFTNm5uLQ6rvvLMQHqNJkq5m7vZy1EwKsV3RiS6p_zp7KOuGL29t4Ucl-HnRyXENix2e3p5johUeP";
const STITCH_PLACEHOLDER = require("../../assets/stitch/onboarding.png");

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="absolute inset-0 z-0">
        <Image
          source={{ uri: HERO }}
          placeholder={STITCH_PLACEHOLDER}
          className="h-full w-full"
          contentFit="cover"
        />
        <View className="absolute inset-0 bg-surface-container-lowest/80" />
      </View>
      <ScrollView
        className="z-10 flex-1"
        contentContainerClassName="flex-grow justify-end px-6 pb-16"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="mb-12 w-full max-w-lg items-center self-center">
          <Text className="mb-4 text-center font-headline text-6xl font-bold tracking-tight text-primary-container">
            GradEcho
          </Text>
          <Text className="max-w-sm text-center font-body text-lg font-light tracking-wide text-on-surface-variant">
            Capture the moment. Relive it forever.
          </Text>
        </View>
        <View className="w-full max-w-sm flex-col gap-4 self-center">
          <PrimaryButton
            label="Get Started"
            onPress={() => router.replace("/capture")}
          />
          <SecondaryButton label="Login" onPress={() => router.replace("/home")} />
        </View>
        <View className="mt-8 items-center">
          <View className="h-1 w-[33%] rounded-full bg-outline-variant/30" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
