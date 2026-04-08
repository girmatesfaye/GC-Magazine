import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { FeedHeader } from "@/components/feed-header";
import { MemoryCard } from "@/components/memory-card";
import { fetchMemories } from "@/lib/memories";
import { fetchCurrentProfile } from "@/lib/profiles";
import { supabase } from "@/lib/supabase";
import type { Memory } from "@/types/memory";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDigwncOBpv2TXfewZ5ZQuJATfKG2H0vfcY5AzyUY2SmhrK72YjKvnNn3dTRKb79BPr100UkJEBb1-CLhQwi7bQTw2M2jGVH-1gErJP3W2GvT1oeWTSZxLoCiZ1Z74Ef6y8Incvc0M0hM86RyHCDLSafFCW991BKHCrVao7FjOsKbyIWPLFrGI-m0tVFby1TK0x7GpDAxqq1TgRt-qqZdo3fjWNGVCuWckcLk-iybxqGS7h99Fjfaoh5ZxyR9KpGCPGQXr_pp9n0SJh";

const FILTERS = ["All", "My University", "My Department", "My Batch"] as const;

export default function HomeFeedScreen() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [avatarUri, setAvatarUri] = useState(AVATAR);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMemories = async () => {
      setLoading(true);
      setDeleteError(null);
      setLoadError(null);

      const [memoriesResult, profileResult] = await Promise.allSettled([
        fetchMemories(),
        fetchCurrentProfile(),
      ]);

      if (!isMounted) {
        return;
      }

      if (memoriesResult.status === "fulfilled") {
        setMemories(memoriesResult.value);
      } else {
        setMemories([]);
        const message =
          memoriesResult.reason instanceof Error
            ? memoriesResult.reason.message
            : "Could not load memories from Supabase.";
        setLoadError(message);
      }

      if (profileResult.status === "fulfilled") {
        const profile = profileResult.value;
        const safeName = profile?.full_name?.trim();
        setIsAdminUser(profile?.is_admin ?? false);
        setAvatarUri(
          profile?.avatar_url ??
            (safeName
              ? `https://api.dicebear.com/9.x/initials/png?seed=${encodeURIComponent(safeName)}`
              : AVATAR),
        );
      } else {
        setIsAdminUser(false);
        setAvatarUri(AVATAR);
      }

      setIsAdminMode(false);
      setLoading(false);
    };

    loadMemories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteMemory = async (id: string) => {
    setDeletingId(id);
    setDeleteError(null);

    const { error } = await supabase.from("memories").delete().eq("id", id);

    setDeletingId(null);

    if (error) {
      setDeleteError(
        error.message ||
          "Delete failed. Supabase rejected the moderation request.",
      );
      Alert.alert("Delete failed", error.message);
      return;
    }

    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const canModerate = isAdminUser;

  return (
    <View className="flex-1 bg-surface">
      <FeedHeader
        avatarUri={avatarUri}
        isAdminMode={isAdminMode}
        onAvatarPress={() =>
          router.push((isAdminUser ? "/admin" : "/profile") as never)
        }
        onAvatarLongPress={() => {
          if (!isAdminUser) {
            setDeleteError(
              "Admin mode is only available for Supabase admin accounts.",
            );
            return;
          }

          setIsAdminMode((v) => !v);
        }}
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
        {loadError ? (
          <View className="mb-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3">
            <Text className="font-label text-[10px] font-bold uppercase tracking-widest text-error">
              {loadError}
            </Text>
          </View>
        ) : null}
        {isAdminMode ? (
          <View className="mb-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3">
            <Text className="font-label text-[10px] font-bold uppercase tracking-widest text-error">
              Admin mode enabled: delete actions now go through Supabase RLS.
            </Text>
          </View>
        ) : null}
        {deleteError ? (
          <View className="mb-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3">
            <Text className="font-label text-[10px] font-bold uppercase tracking-widest text-error">
              {deleteError}
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
        {!loading && memories.length === 0 ? (
          <View className="mb-4 rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-4">
            <Text className="text-center font-body text-on-surface-variant">
              No memories found yet. Share the first memory to start the feed.
            </Text>
          </View>
        ) : null}
        {memories.map((m) => (
          <MemoryCard
            key={m.id}
            memory={m}
            showDelete={isAdminMode && canModerate}
            onDelete={handleDeleteMemory}
            deleting={deletingId === m.id}
            onPress={() =>
              router.push({ pathname: "/memory/[id]", params: { id: m.id } })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
