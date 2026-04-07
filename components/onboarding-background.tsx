import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

type Props = {
  source: React.ComponentProps<typeof Image>["source"];
  overlayOpacity?: number;
};

export function OnboardingBackground({ source, overlayOpacity = 0.2 }: Props) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <Image
        source={source}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` },
        ]}
      />
    </View>
  );
}
