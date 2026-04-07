import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OnboardingBackground } from "@/components/onboarding-background";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";

const BG = require("../../assets/stitch/onboarding.png");

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <OnboardingBackground source={BG} overlayOpacity={0.3} />
      <ScrollView
        className="z-10 flex-1"
        contentContainerClassName="flex-grow justify-end px-6 pb-16"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="mb-12 w-full max-w-lg items-center self-center">
          <Text
            className="mb-4 text-center font-headline text-6xl font-bold tracking-tight text-primary"
            style={{
              textShadowColor: "rgba(0, 0, 0, 0.65)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 10,
            }}
          >
            GradEcho
          </Text>
          <Text
            className="max-w-sm text-center font-body text-lg font-light tracking-wide text-primary"
            style={{
              opacity: 0.92,
              textShadowColor: "rgba(0, 0, 0, 0.55)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 8,
            }}
          >
            Capture the moment. Relive it forever.
          </Text>
        </View>
        <View className="w-full max-w-sm flex-col gap-4 self-center">
          <PrimaryButton
            label="Get Started"
            onPress={() => router.push("/capture")}
          />
          <SecondaryButton
            label="I Already Have Access"
            onPress={() => router.push("/login")}
          />
        </View>
        <View className="mt-8 items-center">
          <View className="h-1 w-[33%] rounded-full bg-outline-variant/30" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
