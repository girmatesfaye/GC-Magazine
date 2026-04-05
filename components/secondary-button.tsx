import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
  className?: string;
};

export function SecondaryButton({ label, onPress, className = "" }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`h-14 w-full items-center justify-center rounded-full border border-outline-variant/20 bg-transparent active:bg-surface-container-low/30 ${className}`}
    >
      <Text className="font-label text-lg font-medium text-primary">{label}</Text>
    </Pressable>
  );
}
