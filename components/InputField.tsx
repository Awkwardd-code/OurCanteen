import { TextInput, View, Text, Image } from "react-native";
import { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle = "",
  containerStyle = "",
  inputStyle = "",
  iconStyle = "",
  className = "",
  ...props
}: InputFieldProps) => {
  return (
    <View className={`my-2 w-full ${className}`}>
      {label && (
        <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
          {label}
        </Text>
      )}
      <View
        className={`flex flex-row items-center bg-neutral-100 rounded-md border border-neutral-100 ${containerStyle}`}
      >
        {icon && (
          <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
        )}
        <TextInput
          className={`flex-1 rounded-full p-4 font-JakartaSemiBold text-[15px] text-left ${inputStyle}`}
          secureTextEntry={secureTextEntry}
          placeholder={props.placeholder || `Enter your ${label?.toLowerCase()}`}
          placeholderTextColor="#888"
          {...props}
        />
      </View>
    </View>
  );
};

export default InputField;
