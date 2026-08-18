import {
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

import LeadCard, {
  Lead,
} from "./LeadCard";

type LeadListProps = {
  leads: Lead[];
  refreshing: boolean;
  onRefresh: () => void;
  onCall: (phone: string) => void;
  onDelete: (id: string) => void;
};

export default function LeadList({
  leads,
  refreshing,
  onRefresh,
  onCall,
  onDelete,
}: LeadListProps) {
  return (
    <FlatList
      data={leads}
      keyExtractor={(item) => item.id}

      showsVerticalScrollIndicator={false}

      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 32,
      }}

      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }

      ListHeaderComponent={
        <View className="mb-3">
          <Text className="text-sm text-gray-500">
            {leads.length}{" "}
            {leads.length === 1
              ? "lead"
              : "leads"}
          </Text>
        </View>
      }

      renderItem={({ item }) => (
        <LeadCard
          lead={item}
          onCall={onCall}
          onDelete={onDelete}
        />
      )}
    />
  );
}