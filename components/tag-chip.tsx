import { Text, View } from "react-native";

type Props = {
  label: string;
};

export function TagChip({ label }: Props) {
  return (
    <View className="rounded-full bg-white/10 px-3 py-1">
      <Text className="font-label text-[10px] font-bold uppercase tracking-widest text-primary-container">
        {label}
      </Text>
    </View>
  );
}
