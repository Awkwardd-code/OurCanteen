import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const innerDimension = 300;

const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
  rect(
    width / 2 - innerDimension / 2,
    height / 2 - innerDimension / 2,
    innerDimension,
    innerDimension
  ),
  50,
  50
);

type OverlayProps = {
  onBack: () => void;
};

export const Overlay: React.FC<OverlayProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Canvas style={StyleSheet.absoluteFill}>
        <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
      </Canvas>

      <View
        style={[
          styles.backButtonContainer,
          {
            top: insets.top + 10,
            left: 10,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    position: "absolute",
    zIndex: 10,
  },
});
