import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
  className?: string;
};

export function PrimaryButton({ label, onPress, className = "" }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`h-14 w-full items-center justify-center rounded-full bg-primary-container active:opacity-90 ${className}`}
    >
      <Text className="font-label text-lg font-bold text-on-primary-container">
        {label}
      </Text>
    </Pressable>
  );
}
