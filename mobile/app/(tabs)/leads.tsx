import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import useLeads from "../../hooks/useLeads";
import useLeadUpload from "../../hooks/useLeadUpload";

import { deleteLead } from "../../services/api.js";

import LeadList from "../../components/leads/LeadList";
import type { Lead } from "../../components/leads/LeadCard";

export default function Leads() {
  // ==========================================
  // LEADS HOOK
  // ==========================================

  const {
    leads,
    setLeads,
    loading,
    refreshing,
    error: leadsError,
    refreshLeads,
    fetchLeads,
    isLoaded,
    isSignedIn,
    getToken,
  } = useLeads();

  // ==========================================
  // UPLOAD HOOK
  // ==========================================

  const {
    uploading,
    error: uploadError,
    pickCSV,
    pickExcel,
    pickImage,
  } = useLeadUpload({
    onSuccess: fetchLeads,
  });

  // ==========================================
  // COMBINED ERROR
  // ==========================================

  const error = leadsError || uploadError;

  // ==========================================
  // CALL LEAD
  // ==========================================

  const handleCall = async (phone: string) => {
    if (!phone) {
      Alert.alert(
        "Error",
        "Phone number is not available"
      );
      return;
    }

    const phoneUrl = `tel:${phone}`;

    try {
      const supported =
        await Linking.canOpenURL(phoneUrl);

      if (!supported) {
        Alert.alert(
          "Unable to Call",
          "This device cannot make phone calls."
        );
        return;
      }

      await Linking.openURL(phoneUrl);
    } catch (error) {
      console.log("Call error:", error);

      Alert.alert(
        "Error",
        "Unable to open phone dialer"
      );
    }
  };

  // ==========================================
  // DELETE CONFIRMATION
  // ==========================================

  const handleDelete = (leadId: string) => {
    Alert.alert(
      "Delete Lead",
      "Are you sure you want to delete this lead?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDelete(leadId),
        },
      ]
    );
  };

  // ==========================================
  // DELETE LEAD
  // ==========================================

  const confirmDelete = async (leadId: string) => {
    try {
      const token = await getToken();

      if (!token) {
        Alert.alert(
          "Authentication Error",
          "Authentication token not available"
        );
        return;
      }

      const data = await deleteLead(
        token,
        leadId
      );

      console.log(
        "Delete response:",
        data
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to delete lead"
        );
      }

      // Remove deleted lead from UI immediately
      setLeads((currentLeads) =>
        currentLeads.filter(
          (lead) => lead.id !== leadId
        )
      );

      Alert.alert(
        "Success",
        "Lead deleted successfully"
      );
    } catch (error: any) {
      console.log(
        "Delete lead error:",
        error
      );

      Alert.alert(
        "Delete Failed",
        error?.response?.data?.message ||
          error?.message ||
          "Unable to delete lead"
      );
    }
  };

  // ==========================================
  // CLERK LOADING
  // ==========================================

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">

          <ActivityIndicator size="large" />

          <Text className="mt-3 text-gray-600">
            Loading...
          </Text>

        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // NOT SIGNED IN
  // ==========================================

  if (!isSignedIn) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">

          <Text className="text-gray-600 text-center">
            Please sign in to view your leads.
          </Text>

        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // INITIAL LOADING
  // ==========================================

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">

          <ActivityIndicator size="large" />

          <Text className="mt-3 text-gray-600">
            Loading leads...
          </Text>

        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // MAIN SCREEN
  // ==========================================

  return (
    <SafeAreaView className="flex-1 bg-gray-100">

      {/* =====================================
          HEADER
      ====================================== */}

      <View className="px-4 pt-4 pb-3 bg-white border-b border-gray-200">

        <View className="flex-row justify-between items-center">

          <View className="flex-1">

            <Text className="text-2xl font-bold text-gray-900">
              Leads
            </Text>

            <Text className="text-sm text-gray-500 mt-1">
              Manage your leads
            </Text>

          </View>

          {/* UPLOAD BUTTONS */}

          <View className="flex-row gap-2">

            {/* CSV */}

            <Pressable
              onPress={pickCSV}
              disabled={uploading}
              className={`px-3 py-2 rounded-lg ${
                uploading
                  ? "bg-blue-300"
                  : "bg-blue-600"
              }`}
            >
              <Text className="text-white font-bold">
                CSV
              </Text>
            </Pressable>

            {/* EXCEL */}

            <Pressable
              onPress={pickExcel}
              disabled={uploading}
              className={`px-3 py-2 rounded-lg ${
                uploading
                  ? "bg-green-300"
                  : "bg-green-600"
              }`}
            >
              <Text className="text-white font-bold">
                Excel
              </Text>
            </Pressable>

            {/* IMAGE */}

            <Pressable
              onPress={pickImage}
              disabled={uploading}
              className={`px-3 py-2 rounded-lg ${
                uploading
                  ? "bg-purple-300"
                  : "bg-purple-600"
              }`}
            >
              <Text className="text-white font-bold">
                Image
              </Text>
            </Pressable>

          </View>

        </View>

      </View>

      {/* =====================================
          UPLOADING
      ====================================== */}

      {uploading && (
        <View className="px-4 py-3 bg-white border-b border-gray-200 flex-row items-center">

          <ActivityIndicator size="small" />

          <Text className="ml-2 text-gray-600">
            Uploading leads...
          </Text>

        </View>
      )}

      {/* =====================================
          ERROR
      ====================================== */}

      {error ? (
        <View className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">

          <Text className="text-red-600">
            {error}
          </Text>

        </View>
      ) : null}

      {/* =====================================
          EMPTY STATE
      ====================================== */}

      {leads.length === 0 ? (

        <View className="flex-1 justify-center items-center px-6">

          <Text className="text-xl font-bold text-gray-700">
            No leads found
          </Text>

          <Text className="text-gray-500 text-center mt-2 mb-5">
            Import a CSV, Excel file or image to add leads.
          </Text>

          <Pressable
            onPress={pickCSV}
            disabled={uploading}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">
              Import CSV
            </Text>
          </Pressable>

        </View>

      ) : (

        /* =====================================
            LEAD LIST
        ====================================== */

        <LeadList
          leads={leads as Lead[]}
          refreshing={refreshing}
          onRefresh={refreshLeads}
          onCall={handleCall}
          onDelete={handleDelete}
        />

      )}

    </SafeAreaView>
  );
}