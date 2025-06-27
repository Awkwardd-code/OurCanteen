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
  error = "",               // added error prop with default empty string
  className = "",
  ...props
}: InputFieldProps & { error?: string }) => {
  return (
    <View className={`my-2 w-full ${className}`}>
      {label && (
        <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
          {label}
        </Text>
      )}
      <View
        className={`flex flex-row items-center bg-neutral-100 rounded-md border ${
          error ? "border-red-500" : "border-neutral-100"
        } ${containerStyle}`}
      >
        {icon && (
          <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
        )}
        <TextInput
          className={`flex-1 rounded-full p-4 font-JakartaSemiBold text-[15px] text-left ${
            error ? "text-red-600" : "text-black"
          } ${inputStyle}`}
          secureTextEntry={secureTextEntry}
          placeholder={props.placeholder || `Enter your ${label?.toLowerCase()}`}
          placeholderTextColor="#888"
          {...props}
        />
      </View>
      {error ? (
        <Text className="mt-1 text-red-600 text-sm ml-4">
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default InputField;
