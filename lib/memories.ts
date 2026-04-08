import { MOCK_MEMORIES, getMemoryById } from "@/constants/mock-memories";
import { supabase } from "@/lib/supabase";
import type { Memory } from "@/types/memory";

type SupabaseMemoryRow = {
  id: string;
  title: string | null;
  quote: string;
  reflection: string | null;
  image_url: string;
  voice_url: string | null;
  voice_label: string | null;
  voice_duration: string | null;
  tags: string[] | null;
  likes_count: number | null;
  created_at: string;
  profiles:
    | {
        full_name: string | null;
        university: string | null;
        department: string | null;
        avatar_url: string | null;
      }
    | Array<{
        full_name: string | null;
        university: string | null;
        department: string | null;
        avatar_url: string | null;
      }>
    | null;
};

function buildMemoryFromRow(row: SupabaseMemoryRow): Memory {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  const authorName = profile?.full_name ?? "Anonymous";
  const university = profile?.university ?? "";
  const department = profile?.department ?? "";

  return {
    id: row.id,
    authorName,
    authorMeta: department || "Member",
    university,
    imageUri: row.image_url,
    avatarUri:
      profile?.avatar_url ??
      `https://api.dicebear.com/9.x/initials/png?seed=${encodeURIComponent(authorName)}`,
    quote: row.quote,
    tags: row.tags ?? [],
    likesCount:
      typeof row.likes_count === "number"
        ? row.likes_count.toLocaleString()
        : "0",
    title: row.title ?? undefined,
    reflection: row.reflection ?? undefined,
    hasVoice: Boolean(row.voice_url),
    voiceLabel: row.voice_label ?? undefined,
    voiceDuration: row.voice_duration ?? undefined,
  };
}

export async function fetchMemories(): Promise<Memory[]> {
  const { data, error } = await supabase
    .from("memories")
    .select(
      `
        id,
        title,
        quote,
        reflection,
        image_url,
        voice_url,
        voice_label,
        voice_duration,
        tags,
        likes_count,
        created_at,
        profiles (
          full_name,
          university,
          department,
          avatar_url
        )
      `,
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return MOCK_MEMORIES;
  }

  if (data.length === 0) {
    return MOCK_MEMORIES;
  }

  return (data as unknown as SupabaseMemoryRow[]).map(buildMemoryFromRow);
}

export async function fetchMemoryById(id: string): Promise<Memory | undefined> {
  const { data, error } = await supabase
    .from("memories")
    .select(
      `
        id,
        title,
        quote,
        reflection,
        image_url,
        voice_url,
        voice_label,
        voice_duration,
        tags,
        likes_count,
        created_at,
        profiles (
          full_name,
          university,
          department,
          avatar_url
        )
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return getMemoryById(id);
  }

  return buildMemoryFromRow(data as unknown as SupabaseMemoryRow);
}
