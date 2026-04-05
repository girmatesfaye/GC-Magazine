import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { FeedHeader } from "@/components/feed-header";
import { MemoryCard } from "@/components/memory-card";
import { MOCK_MEMORIES } from "@/constants/mock-memories";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDigwncOBpv2TXfewZ5ZQuJATfKG2H0vfcY5AzyUY2SmhrK72YjKvnNn3dTRKb79BPr100UkJEBb1-CLhQwi7bQTw2M2jGVH-1gErJP3W2GvT1oeWTSZxLoCiZ1Z74Ef6y8Incvc0M0hM86RyHCDLSafFCW991BKHCrVao7FjOsKbyIWPLFrGI-m0tVFby1TK0x7GpDAxqq1TgRt-qqZdo3fjWNGVCuWckcLk-iybxqGS7h99Fjfaoh5ZxyR9KpGCPGQXr_pp9n0SJh";

const FILTERS = ["All", "My University", "My Department", "My Batch"] as const;

export default function HomeFeedScreen() {
  return (
    <View className="flex-1 bg-surface">
      <FeedHeader avatarUri={AVATAR} />
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerClassName="pb-32"
        contentInsetAdjustmentBehavior="automatic"
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-8 flex-row gap-3 py-2"
          contentContainerClassName="gap-3 pr-4"
        >
          {FILTERS.map((f, i) => (
            <Pressable
              key={f}
              className={`rounded-full px-6 py-2.5 ${i === 0 ? "bg-primary-container" : "border border-outline-variant/15 bg-surface-container-low"}`}
            >
              <Text
                className={`font-headline text-sm font-semibold ${i === 0 ? "text-on-primary-container" : "text-on-surface-variant"}`}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        {MOCK_MEMORIES.map((m) => (
          <MemoryCard
            key={m.id}
            memory={m}
            onPress={() =>
              router.push({ pathname: "/memory/[id]", params: { id: m.id } })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
