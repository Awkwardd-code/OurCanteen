import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

const ChartTab: React.FC = () => {
  const [selected, setSelected] = useState<
    "optionOne" | "optionTwo" | "optionThree"
  >("optionOne");

  const renderButton = (
    label: string,
    option: "optionOne" | "optionTwo" | "optionThree"
  ) => {
    const isActive = selected === option;

    return (
      <Pressable
        onPress={() => setSelected(option)}
        style={[
          styles.button,
          isActive ? styles.activeButton : styles.inactiveButton,
        ]}
      >
        <Text style={[styles.buttonText, isActive && styles.activeText]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {renderButton("Monthly", "optionOne")}
      {renderButton("Quarterly", "optionTwo")}
      {renderButton("Annually", "optionThree")}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6", // Tailwind's gray-100
    borderRadius: 8,
    padding: 4,
    marginTop: 16,
    alignSelf: "flex-start",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeButton: {
    backgroundColor: "#ffffff", // white
    elevation: 2, // subtle shadow
  },
  inactiveButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 14,
    color: "#6b7280", // Tailwind's gray-500
    fontWeight: "500",
  },
  activeText: {
    color: "#111827", // Tailwind's gray-900
  },
});

export default ChartTab;
