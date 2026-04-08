import { supabase } from "@/lib/supabase";

const MEMORY_MEDIA_BUCKET = "memory-media";

function getFileExtension(uri: string, fallback = "jpg") {
  const match = uri.split(".").pop()?.split("?")[0]?.split("#")[0];
  if (!match || match.length > 5) {
    return fallback;
  }

  return match;
}

function getMimeTypeFromExtension(extension: string) {
  switch (extension.toLowerCase()) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
    case "heif":
      return "image/heic";
    default:
      return "image/jpeg";
  }
}

export async function uploadMemoryImage({
  userId,
  uri,
}: {
  userId: string;
  uri: string;
}) {
  const fileExtension = getFileExtension(uri);
  const mimeType = getMimeTypeFromExtension(fileExtension);
  const filePath = `${userId}/${Date.now()}.${fileExtension}`;

  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from(MEMORY_MEDIA_BUCKET)
    .upload(filePath, blob, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from(MEMORY_MEDIA_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
