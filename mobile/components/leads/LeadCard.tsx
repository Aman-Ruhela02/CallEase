import {
  Pressable,
  Text,
  View,
} from "react-native";

export type Lead = {
  id: string;
  name: string | null;
  phone: string;
  location: string | null;
};

type LeadCardProps = {
  lead: Lead;
  onCall: (phone: string) => void;
  onDelete: (id: string) => void;
};

export default function LeadCard({
  lead,
  onCall,
  onDelete,
}: LeadCardProps) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">

      {/* Header */}
      <View className="flex-row items-center">

        {/* Avatar */}
        <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-3">
          <Text className="text-blue-700 text-lg font-bold">
            {lead.name?.charAt(0)?.toUpperCase() || "?"}
          </Text>
        </View>

        {/* Name */}
        <View className="flex-1">
          <Text
            className="text-base font-bold text-gray-900"
            numberOfLines={1}
          >
            {lead.name || "Unnamed Lead"}
          </Text>

          <Text
            className="text-sm text-gray-500 mt-1"
            numberOfLines={1}
          >
            {lead.location || "Location not available"}
          </Text>
        </View>

      </View>

      {/* Phone */}
      <View className="bg-gray-50 rounded-xl px-3 py-3 mt-4">
        <Text className="text-xs text-gray-400 mb-1">
          PHONE NUMBER
        </Text>

        <Text className="text-gray-800 font-medium">
          {lead.phone || "No phone number"}
        </Text>
      </View>

      {/* Actions */}
      <View className="flex-row mt-4 gap-3">

        {/* Call */}
        <Pressable
          onPress={() => onCall(lead.phone)}
          disabled={!lead.phone}
          className="flex-1 bg-green-600 py-3 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-bold">
            Call
          </Text>
        </Pressable>

        {/* Delete */}
        <Pressable
          onPress={() => onDelete(lead.id)}
          className="px-6 py-3 rounded-xl items-center bg-red-50 active:opacity-70"
        >
          <Text className="text-red-600 font-semibold">
            Delete
          </Text>
        </Pressable>

      </View>

    </View>
  );
}