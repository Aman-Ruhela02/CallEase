import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  Alert,
  Linking, 

} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";


import { getLeads } from "../../services/api.js";

export default function Home() {
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://192.168.1.8:3000";

  const userName = user?.firstName || user?.username || "there";

  // --------------------------------
  // FETCH LEADS
  // --------------------------------

  const fetchLeads = async () => {
    try {
      setError("");

      const token = await getToken();

      if (!token) {
        setError("Authentication token not available");
        return;
      }

      const data = await getLeads(token);

      console.log("Home leads:", data);

      if (data.success) {
        setLeads(data.data || []);
      } else {
        setError(data.message || "Failed to fetch leads");
      }
    } catch (error) {
      console.log("Home get leads error:", error);
      setError("Unable to fetch leads");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --------------------------------
  // FETCH WHEN HOME OPENS
  // --------------------------------

  useFocusEffect(
    useCallback(() => {
      if (isLoaded && isSignedIn) {
        fetchLeads();
      }
    }, [isLoaded, isSignedIn])
  );

  // --------------------------------
  // REFRESH
  // --------------------------------

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeads();
  };

  // --------------------------------
  // RECENT LEADS
  // --------------------------------

  const recentLeads = leads.slice(0, 3);

  const handlePickCSV = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];

    if (!file.name.toLowerCase().endsWith(".csv")) {
      Alert.alert("Invalid file", "Please select a CSV file.");
      return;
    }

    await uploadCSV(file);
  } catch (error) {
    console.log("CSV picker error:", error);
    Alert.alert("Error", "Unable to select CSV file");
  }
};

// -------------------------
// UPLOAD CSV
// -------------------------
const uploadCSV = async (file: any) => {
  try {
    const token = await getToken();

    if (!token) {
      Alert.alert("Authentication Error", "Token not available");
      return;
    }

    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      name: file.name || "leads.csv",
      type: file.mimeType || "text/csv",
    } as any);

    console.log("Uploading CSV from Home...");

    const response = await fetch(
      `${API_URL}/api/upload/csv`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    console.log("CSV upload response:", data);

    if (!response.ok || !data.success) {
      throw new Error(data.message || "CSV upload failed");
    }

    Alert.alert(
      "Success",
      `${data.count} leads imported successfully`
    );

    // Refresh dashboard/leads
    await fetchLeads();

  } catch (error: any) {
    console.log("CSV upload error:", error);

    Alert.alert(
      "Upload Failed",
      error?.message || "Unable to upload CSV"
    );
  }
};

// -------------------------
// PICK EXCEL
// -------------------------
const handlePickExcel = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];

    const fileName = file.name.toLowerCase();

    if (
      !fileName.endsWith(".xlsx") &&
      !fileName.endsWith(".xls")
    ) {
      Alert.alert(
        "Invalid file",
        "Please select an Excel file (.xlsx or .xls)."
      );
      return;
    }

    await uploadExcel(file);

  } catch (error) {
    console.log("Excel picker error:", error);

    Alert.alert(
      "Error",
      "Unable to select Excel file"
    );
  }
};

// -------------------------
// UPLOAD EXCEL
// -------------------------
const uploadExcel = async (file: any) => {
  try {
    const token = await getToken();

    if (!token) {
      Alert.alert(
        "Authentication Error",
        "Token not available"
      );
      return;
    }

    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      name: file.name || "leads.xlsx",
      type:
        file.mimeType ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    } as any);

    console.log("Uploading Excel from Home...");

    const response = await fetch(
      `${API_URL}/api/upload/excel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    console.log("Excel upload response:", data);

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Excel upload failed"
      );
    }

    Alert.alert(
      "Success",
      `${data.count} leads imported successfully`
    );

    await fetchLeads();

  } catch (error: any) {
    console.log("Excel upload error:", error);

    Alert.alert(
      "Upload Failed",
      error?.message || "Unable to upload Excel"
    );
  }
};

// -------------------------
// PICK IMAGE
// -------------------------
const handlePickImage = async () => {
  try {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your photos."
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });

    if (result.canceled) return;

    const image = result.assets[0];

    console.log("Selected image:", image);

    await uploadImage(image);

  } catch (error) {
    console.log("Image picker error:", error);

    Alert.alert(
      "Error",
      "Unable to select image"
    );
  }
};

// -------------------------
// UPLOAD IMAGE
// -------------------------
const uploadImage = async (image: any) => {
  try {
    const token = await getToken();

    if (!token) {
      Alert.alert(
        "Authentication Error",
        "Token not available"
      );
      return;
    }

    const formData = new FormData();

    formData.append("file", {
      uri: image.uri,
      name: image.fileName || "lead-image.jpg",
      type: image.mimeType || "image/jpeg",
    } as any);

    console.log("Uploading image from Home...");

    const response = await fetch(
      `${API_URL}/api/upload/image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    console.log("Image upload response:", data);

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Image upload failed"
      );
    }

    Alert.alert(
      "Success",
      `${data.count || "Image"} leads imported successfully`
    );

    await fetchLeads();

  } catch (error: any) {
    console.log("Image upload error:", error);

    Alert.alert(
      "Upload Failed",
      error?.message || "Unable to upload image"
    );
  }
};

  // --------------------------------
  // LOADING
  // --------------------------------

  if (!isLoaded || loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />

          <Text className="mt-3 text-gray-500">
            Loading dashboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >

        {/* HEADER */}

        <View className="px-5 pt-5 pb-6">

          <Text className="text-gray-500 text-base">
            Welcome back 👋
          </Text>

          <Text className="text-3xl font-bold text-gray-900 mt-1">
            {userName}
          </Text>

          <Text className="text-gray-500 mt-2">
            Manage your leads and make calls easily.
          </Text>

        </View>


        {/* ERROR */}

        {error ? (
          <View className="mx-5 mb-4 bg-red-50 rounded-xl p-4">
            <Text className="text-red-600">
              {error}
            </Text>
          </View>
        ) : null}


        {/* TOTAL LEADS */}

        <View className="px-5">

          <View className="bg-blue-600 rounded-2xl p-5">

            <Text className="text-blue-100 text-sm">
              Total Leads
            </Text>

            <Text className="text-white text-4xl font-bold mt-2">
              {leads.length}
            </Text>

            <Pressable
              onPress={() => router.push("/(tabs)/leads")}
              className="bg-white self-start px-4 py-2 rounded-lg mt-4"
            >
              <Text className="text-blue-600 font-bold">
                View Leads
              </Text>
            </Pressable>

          </View>

        </View>


        {/* QUICK IMPORT */}

        <View className="px-5 mt-7">

          <Text className="text-xl font-bold text-gray-900 mb-4">
            Import Leads
          </Text>

          <View className="flex-row gap-3">

            {/* CSV */}

            <Pressable
              onPress={handlePickCSV}
              className="flex-1 bg-white rounded-2xl p-4 border border-gray-200"
            >

              <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center">
                <Text className="text-2xl">
                  📄
                </Text>
              </View>

              <Text className="font-bold text-gray-900 mt-3">
                CSV
              </Text>

              <Text className="text-gray-500 text-xs mt-1">
                Import CSV
              </Text>

            </Pressable>


            {/* EXCEL */}

            <Pressable
              onPress={handlePickExcel}
              className="flex-1 bg-white rounded-2xl p-4 border border-gray-200"
            >

              <View className="w-12 h-12 bg-green-100 rounded-xl items-center justify-center">
                <Text className="text-2xl">
                  📊
                </Text>
              </View>

              <Text className="font-bold text-gray-900 mt-3">
                Excel
              </Text>

              <Text className="text-gray-500 text-xs mt-1">
                Import Excel
              </Text>

            </Pressable>


            {/* IMAGE */}

            <Pressable
              onPress={handlePickImage}
              className="flex-1 bg-white rounded-2xl p-4 border border-gray-200"
            >

              <View className="w-12 h-12 bg-purple-100 rounded-xl items-center justify-center">
                <Text className="text-2xl">
                  🖼️
                </Text>
              </View>

              <Text className="font-bold text-gray-900 mt-3">
                Image
              </Text>

              <Text className="text-gray-500 text-xs mt-1">
                Scan leads
              </Text>

            </Pressable>

          </View>

        </View>


        {/* RECENT LEADS */}

        <View className="px-5 mt-7">

          <View className="flex-row justify-between items-center mb-4">

            <Text className="text-xl font-bold text-gray-900">
              Recent Leads
            </Text>

            <Pressable
              onPress={() => router.push("/(tabs)/leads")}
            >
              <Text className="text-blue-600 font-semibold">
                View All
              </Text>
            </Pressable>

          </View>


          {/* NO LEADS */}

          {recentLeads.length === 0 ? (

            <View className="bg-white rounded-2xl p-6 items-center border border-gray-200">

              <Text className="text-4xl">
                📋
              </Text>

              <Text className="text-gray-900 font-bold text-lg mt-3">
                No leads yet
              </Text>

              <Text className="text-gray-500 text-center mt-1">
                Import a CSV, Excel file or image to get started.
              </Text>

              <Pressable
                onPress={() =>
                  router.push("/(tabs)/leads")
                }
                className="bg-blue-600 px-6 py-3 rounded-xl mt-5"
              >
                <Text className="text-white font-bold">
                  Import Leads
                </Text>
              </Pressable>

            </View>

          ) : (

            <View className="gap-3">

              {recentLeads.map((lead) => (

                <View
                  key={lead.id}
                  className="bg-white rounded-2xl p-4 border border-gray-200"
                >

                  {/* NAME */}

                  <Text className="text-lg font-bold text-gray-900">
                    {lead.name || "-"}
                  </Text>


                  {/* PHONE */}

                  <Text className="text-gray-600 mt-2">
                    📞 {lead.phone || "-"}
                  </Text>


                  {/* LOCATION */}

                  <Text className="text-gray-500 mt-1">
                    📍 {lead.location || "-"}
                  </Text>


                  {/* CALL BUTTON */}

                  <Pressable
                    onPress={() => {
                      // We'll connect the Call functionality here
                      // later if required.
                    }}
                    className="bg-green-600 rounded-xl py-2 mt-3 items-center"
                  >
                    <Text className="text-white font-bold">
                      Call
                    </Text>
                  </Pressable>

                </View>

              ))}

            </View>

          )}

        </View>


        {/* APP INFO */}

        <View className="px-5 mt-7">

          <View className="bg-white rounded-2xl p-5 border border-gray-200">

            <Text className="text-lg font-bold text-gray-900">
              CallEase
            </Text>

            <Text className="text-gray-500 mt-1">
              Simple lead management for telecallers.
            </Text>

          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}