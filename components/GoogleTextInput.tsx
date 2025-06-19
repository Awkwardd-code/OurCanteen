import React from "react";
import {
  TextInput,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  icon: any;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  iconColor?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  handlePress?: () => void;
}

const GoogleTextInput = ({
  icon,
  containerStyle,
  inputStyle,
  iconStyle,
  iconColor,
  placeholder = "Search for restaurants or dishes",
  placeholderTextColor,
  handlePress,
}: Props) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        { backgroundColor: theme.colors.card },
        containerStyle,
      ]}
      activeOpacity={0.8}
    >
      <Image
        source={icon}
        style={[
          styles.icon,
          { tintColor: iconColor || theme.colors.primary },
          iconStyle,
        ]}
        resizeMode="contain"
      />
      <TextInput
        style={[
          styles.input,
          { color: theme.colors.text },
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || theme.colors.textSecondary}
        editable={false} // Makes it non-editable since it's just for search press
      />
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
  } as ImageStyle,
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  } as TextStyle,
};

export default GoogleTextInput;