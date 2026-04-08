import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/primary-button";
import { uploadMemoryImage } from "@/lib/storage";
import { supabase } from "@/lib/supabase";

const USER_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAH2kjIoZLn6ZXpKx6f3Mmfx0sclCivIJdkRXHOAUqtqL-vGa-VmQhhpyrxVhrQ4Uldi3Aw2pKNOZVmC3UX-a_59oQRx0Ue8JewbVw-Xra6t3_nvTH2505UsDjN6-xrkebk7CSCF5bjMTN4IqapIiZw6Dw_dUl_HiXSv1IVptje0t_m05CS-ivDVFxy-NWBdXlKUI5v_WCtSUpPxp8N_ozGErVcZhLwq1moW7HW4pJWkg8zPamp_BfBVESacvtXVimMbfwUs1VhdxtK";

function buildTitle(text: string) {
  const compact = text.trim().replace(/\s+/g, " ");
  if (!compact) {
    return "Untitled Memory";
  }

  return compact.slice(0, 48);
}

function parseTags(rawTags: string) {
  return rawTags
    .split(" ")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
}

export default function CreateMemoryScreen() {
  const insets = useSafeAreaInsets();
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [quote, setQuote] = useState("");
  const [reflection, setReflection] = useState("");
  const [tagsText, setTagsText] = useState("#graduation #memories");
  const [loading, setLoading] = useState(false);

  const pickCoverImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.9,
    });

    if (!result.canceled) {
      setCoverUri(result.assets[0]?.uri ?? null);
    }
  };

  const handleShareMemory = async () => {
    if (!coverUri) {
      Alert.alert("Missing image", "Please choose a cover image first.");
      return;
    }

    if (!quote.trim()) {
      Alert.alert("Missing text", "Please add your memory narration.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      Alert.alert("Not signed in", "Please sign in again to share a memory.");
      router.replace("/login");
      return;
    }

    try {
      const imageUrl = await uploadMemoryImage({
        userId: user.id,
        uri: coverUri,
      });

      const payload = {
        user_id: user.id,
        title: buildTitle(quote),
        quote: quote.trim(),
        reflection: reflection.trim() || null,
        image_url: imageUrl,
        voice_url: null,
        voice_label: null,
        voice_duration: null,
        tags: parseTags(tagsText),
      };

      const { data, error } = await supabase
        .from("memories")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      router.replace({ pathname: "/memory/[id]", params: { id: data.id } });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save memory.";
      Alert.alert("Upload failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1 bg-surface"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-row items-center justify-between bg-surface/80 px-6 py-4">
          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="close" size={28} color="#ffd700" />
            </Pressable>
            <Text className="font-headline text-xl font-black tracking-tighter text-primary-container">
              GradEcho
            </Text>
          </View>
          <View className="h-10 w-10 overflow-hidden rounded-full border border-outline-variant/20">
            <Image
              source={{ uri: USER_AVATAR }}
              className="h-full w-full"
              contentFit="cover"
            />
          </View>
        </View>
        <ScrollView
          className="flex-1 px-6 pt-8"
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
          contentInsetAdjustmentBehavior="automatic"
          automaticallyAdjustKeyboardInsets
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Text className="mb-2 font-headline text-4xl font-bold tracking-tight text-primary">
            Immortalize the Moment
          </Text>
          <Text className="mb-10 font-body text-lg text-on-surface-variant">
            Every frame tells a story of your journey.
          </Text>

          <Pressable
            onPress={pickCoverImage}
            className="relative mb-8 overflow-hidden rounded-lg bg-surface-container-low"
          >
            <View className="aspect-[16/10] w-full items-center justify-center">
              {coverUri ? (
                <>
                  <Image
                    source={{ uri: coverUri }}
                    className="absolute inset-0 h-full w-full"
                    contentFit="cover"
                  />
                  <View className="absolute inset-0 bg-black/25" />
                </>
              ) : (
                <>
                  <Image
                    source={{
                      uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3SI7ZozL6Ty8bYxPxcPEgufRNu54weHaJWR1Nksas5LNYUcjp3LtkCAnWPHo96TibgdFMcfhCUwHQvX1w4TfD3D7JNf69Xqmu3fSCIshRpJjqhvdWreph__lu9QAOmV7cNpRyq-M8XdXAsxpJECXEK7VGzJeKWiJVYHwtn06L3Pc9ePDA6d1_mmkPe6RqOKPWj8ezSf6-OmCqll4-Zt2GNwj8iYCUWFK_TzG26MMnb-LIHfucTtzgwNHEMZpjqoBNGsSeo8mqcHWm",
                    }}
                    className="absolute inset-0 h-full w-full opacity-40"
                    contentFit="cover"
                  />
                  <View className="z-10 items-center gap-4">
                    <View className="h-16 w-16 items-center justify-center rounded-full border border-outline-variant/15 bg-surface-container-high/80">
                      <Ionicons name="camera" size={32} color="#fff6df" />
                    </View>
                    <Text className="font-label text-sm uppercase tracking-[0.1em] text-primary">
                      Tap to choose cover image
                    </Text>
                  </View>
                </>
              )}
            </View>
          </Pressable>

          <View className="mb-8 rounded-lg border border-outline-variant/10 bg-surface-container-high/40 p-6">
            <Text className="mb-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              The Narrative
            </Text>
            <TextInput
              multiline
              value={quote}
              onChangeText={setQuote}
              placeholder="How do you feel?"
              placeholderTextColor="#353534"
              className="min-h-[120px] flex-1 font-headline text-xl text-on-surface"
            />
            <View className="mt-4 flex-row items-center gap-3 rounded-full border border-outline-variant/10 bg-surface-container-low px-4 py-3">
              <Ionicons name="mic" size={18} color="#ffd700" />
              <Text className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                Voice memo upload coming next
              </Text>
            </View>
          </View>

          <View className="mb-6 rounded-lg border border-outline-variant/10 bg-surface-container-high/40 p-6">
            <Text className="mb-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              End Words
            </Text>
            <TextInput
              multiline
              value={reflection}
              onChangeText={setReflection}
              placeholder="Your final words to the class..."
              placeholderTextColor="#353534"
              className="min-h-[80px] font-headline text-xl text-on-surface"
            />
          </View>

          <View className="mb-8 flex-row items-center gap-4 rounded-lg border border-outline-variant/10 bg-surface-container-high/40 p-6">
            <Ionicons name="pricetag-outline" size={24} color="#d0c6ab" />
            <View className="flex-1">
              <Text className="mb-1 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                Memory Tags
              </Text>
              <TextInput
                value={tagsText}
                onChangeText={setTagsText}
                placeholder="Add tags (e.g., #graduation #memories)"
                placeholderTextColor="#353534"
                className="font-body text-base text-on-surface"
              />
            </View>
          </View>
        </ScrollView>
        <View
          className="border-t border-outline-variant/20 bg-surface/90 px-6 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <PrimaryButton
            label={loading ? "Saving..." : "Share Memory"}
            onPress={handleShareMemory}
            className="h-16"
            textClassName="font-headline text-xl font-extrabold tracking-tight"
            disabled={loading}
          />
          {loading ? (
            <View className="mt-3 flex-row items-center justify-center gap-2">
              <ActivityIndicator size="small" color="#ffd700" />
              <Text className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                Uploading to Supabase
              </Text>
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
