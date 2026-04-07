import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";

export default function AdminScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1 px-6 pt-10"
        contentContainerClassName="gap-6 pb-24"
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text className="font-headline text-4xl font-black tracking-tight text-primary-container">
          Admin Tools
        </Text>
        <Text className="font-body text-base leading-relaxed text-on-surface-variant">
          This is a frontend-only admin prototype. Long-press the home avatar to
          toggle admin mode, then use trash icons on feed cards to delete posts
          from the local list.
        </Text>
        <View className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
          <Text className="font-label text-[10px] font-bold uppercase tracking-widest text-primary">
            Note
          </Text>
          <Text className="mt-2 font-body text-sm text-on-surface-variant">
            Real moderation must be enforced on backend with role checks and
            secure delete endpoints.
          </Text>
        </View>
        <PrimaryButton
          label="Back to Home"
          onPress={() => router.replace("/home")}
        />
        <SecondaryButton
          label="Go to Profile"
          onPress={() => router.push("/profile")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
