import { View, Text, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";


interface SelectFieldProps {
  label?: string;
  icon?: any;
  items?: { label: string; value: string }[];
  selectedValue?: string;
  onValueChange?: (value: string) => void;
  labelStyle?: string;
  containerStyle?: string;
  selectStyle?: string;
  iconStyle?: string;
  className?: string;
  [key: string]: any;
}

const SelectField = ({
  label,
  icon,
  items = [],
  selectedValue,
  onValueChange,
  labelStyle = "",
  containerStyle = "",
  selectStyle = "",
  iconStyle = "",
  className = "",
  ...props
}: SelectFieldProps) => {
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
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={{ flex: 1 }}
          className={`p-4 font-JakartaSemiBold text-[15px] text-left ${selectStyle}`}
          {...props}
        >
          {items.length === 0 && (
            <Picker.Item
              label={`Select ${label?.toLowerCase() || "an option"}`}
              value=""
              enabled={false}
            />
          )}
          {items.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default SelectField;