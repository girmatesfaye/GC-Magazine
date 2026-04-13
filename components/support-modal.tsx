import { Ionicons } from "@expo/vector-icons";
import { Alert, Linking, Modal, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function SupportModal({ visible, onClose, onConfirm }: Props) {
  const handleOpenTelegram = async () => {
    try {
      await Linking.openURL("https://t.me/girma_thoughts");
    } catch {
      Alert.alert("Could not open Telegram", "Please try again in a moment.");
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/70 px-6">
        <View className="w-full max-w-sm rounded-3xl border border-outline-variant/25 bg-surface-container-low p-6">
          <Text className="font-headline text-2xl font-bold text-primary">
            Support GC Magazine
          </Text>
          <Text className="mt-2 font-body text-sm leading-relaxed text-on-surface-variant">
            You’ve been scrolling… now pay the coffee tax ☕😏{" "}
          </Text>
          <View className="mt-6 gap-3">
            <Pressable
              onPress={onConfirm}
              className="h-12 items-center justify-center rounded-full bg-primary-container"
            >
              <Text className="font-label text-base font-bold text-on-primary-container">
                Buy Coffee to Support
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                void handleOpenTelegram();
              }}
              className="h-12 flex-row items-center justify-center gap-2 rounded-full border border-outline-variant/30 bg-surface"
            >
              <Ionicons name="paper-plane-outline" size={18} color="#8b7f59" />
              <Text className="font-label text-base font-medium text-primary">
                Telegram
              </Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              className="h-12 items-center justify-center rounded-full border border-outline-variant/30 bg-surface"
            >
              <Text className="font-label text-base font-medium text-primary">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
