import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { FeedHeader } from "@/components/feed-header";
import { MemoryCard } from "@/components/memory-card";
import { MOCK_MEMORIES } from "@/constants/mock-memories";
import { fetchMemories } from "@/lib/memories";
import type { Memory } from "@/types/memory";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDigwncOBpv2TXfewZ5ZQuJATfKG2H0vfcY5AzyUY2SmhrK72YjKvnNn3dTRKb79BPr100UkJEBb1-CLhQwi7bQTw2M2jGVH-1gErJP3W2GvT1oeWTSZxLoCiZ1Z74Ef6y8Incvc0M0hM86RyHCDLSafFCW991BKHCrVao7FjOsKbyIWPLFrGI-m0tVFby1TK0x7GpDAxqq1TgRt-qqZdo3fjWNGVCuWckcLk-iybxqGS7h99Fjfaoh5ZxyR9KpGCPGQXr_pp9n0SJh";

const FILTERS = ["All", "My University", "My Department", "My Batch"] as const;

export default function HomeFeedScreen() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadMemories = async () => {
      setLoading(true);
      const nextMemories = await fetchMemories();

      if (!isMounted) {
        return;
      }

      setMemories(nextMemories);
      setUsingFallback(nextMemories === MOCK_MEMORIES);
      setLoading(false);
    };

    loadMemories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <View className="flex-1 bg-surface">
      <FeedHeader
        avatarUri={AVATAR}
        isAdminMode={isAdminMode}
        onAvatarPress={() => router.push("/admin" as never)}
        onAvatarLongPress={() => setIsAdminMode((v) => !v)}
      />
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerClassName="pb-32"
        contentInsetAdjustmentBehavior="automatic"
      >
        {loading ? (
          <View className="mb-4 rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
            <Text className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Loading memories from Supabase...
            </Text>
          </View>
        ) : null}
        {!loading && usingFallback ? (
          <View className="mb-4 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3">
            <Text className="font-label text-[10px] font-bold uppercase tracking-widest text-secondary">
              Supabase unavailable, showing mock feed fallback.
            </Text>
          </View>
        ) : null}
        {isAdminMode ? (
          <View className="mb-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3">
            <Text className="font-label text-[10px] font-bold uppercase tracking-widest text-error">
              Admin mode enabled: tap trash icon on any post to delete it from
              feed.
            </Text>
          </View>
        ) : null}
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
        {memories.map((m) => (
          <MemoryCard
            key={m.id}
            memory={m}
            showDelete={isAdminMode}
            onDelete={handleDeleteMemory}
            onPress={() =>
              router.push({ pathname: "/memory/[id]", params: { id: m.id } })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
