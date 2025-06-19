import { View, Text, Image, ImageSourcePropType } from "react-native";

type UserCardProps = {
  name: string;
  email: string;
  image: string | ImageSourcePropType;
};

const UserCard = ({ name, email, image }: UserCardProps) => {
  return (
    <View className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Top banner */}
      <View className="h-20 bg-primary-500 w-full" />

      {/* Floating avatar */}
      <View className="items-center -mt-10">
        <Image
          source={typeof image === "string" ? { uri: image } : image}
          className="w-20 h-20 rounded-full border-4 border-white"
          resizeMode="cover"
        />
      </View>

      {/* Details */}
      <View className="items-center px-4 py-4">
        <Text className="text-lg font-semibold text-gray-800">{name}</Text>
        <Text className="text-sm text-gray-500 mt-1">{email}</Text>
      </View>
    </View>
  );
};

export default UserCard;
