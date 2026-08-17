import { useAuth } from "@clerk/expo";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import { getLeads, deleteLead } from "../../services/api.js";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "http://192.168.1.8:3000";

export default function Leads() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // -------------------------
  // GET LEADS
  // -------------------------
  const fetchLeads = async () => {
    try {
      setError("");

      const token = await getToken();

      if (!token) {
        setError("Authentication token not available");
        return;
      }

      const data = await getLeads(token);

      console.log("Leads received:", data);

      if (data.success) {
        setLeads(data.data || []);
      } else {
        setError(data.message || "Failed to fetch leads");
      }
    } catch (error) {
      console.log("Get leads error:", error);
      setError("Unable to fetch leads");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // -------------------------
  // LOAD LEADS WHEN SCREEN OPENS
  // -------------------------
  useFocusEffect(
    useCallback(() => {
      if (isLoaded && isSignedIn) {
        fetchLeads();
      }
    }, [isLoaded, isSignedIn])
  );

  // -------------------------
  // REFRESH
  // -------------------------
  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeads();
  };

  // -------------------------
  // PICK CSV
  // -------------------------
  const handlePickCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log("CSV selection cancelled");
        return;
      }

      const file = result.assets[0];

      console.log("Selected CSV:", file);

      if (!file.name.toLowerCase().endsWith(".csv")) {
     Alert.alert(
    "Invalid file",
    "Please select a CSV file."
  );
  return;
}

      await uploadCSV(file);
    } catch (error) {
      console.log("CSV picker error:", error);

      Alert.alert(
        "Error",
        "Unable to select CSV file"
      );
    }
  };


  //PICK EXCEL
  const handlePickExcel = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      console.log("Excel selection cancelled");
      return;
    }

    const file = result.assets[0];

    console.log("Selected Excel:", file);

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



const uploadExcel = async (file: any) => {
  try {
    setUploading(true);
    setError("");

    const token = await getToken();

    if (!token) {
      Alert.alert(
        "Authentication Error",
        "Authentication token not available"
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

    console.log("Uploading Excel...");

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
  } finally {
    setUploading(false);
  }
};

  // -------------------------
  // UPLOAD CSV
  // -------------------------
  const uploadCSV = async (file: any) => {
    try {
      setUploading(true);
      setError("");

      if (!isLoaded || !isSignedIn) {
      Alert.alert(
        "Authentication Error",
        "Please wait until you are signed in."
      );
      return;
    }

      const token = await getToken();
        

      if (!token) {
        Alert.alert(
          "Authentication Error",
          "Authentication token not available"
        );
        return;
      }

      const formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        name: file.name || "leads.csv",
        type: file.mimeType || "text/csv",
      } as any);

      console.log("Uploading CSV...");

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

      console.log("Upload HTTP status:", response.status);
      const data = await response.json();

      console.log("CSV upload response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "CSV upload failed"
        );
      }

      Alert.alert(
        "Success",
        `${data.count} leads imported successfully`
      );

      // Refresh leads after successful import
      await fetchLeads();

    } catch (error: any) {
      console.log("CSV upload error:-", error);

      Alert.alert(
        "Upload Failed",
        error?.message || "Unable to upload CSV"
      );
    } finally {
      setUploading(false);
    }
  };


  const handleCall = async(phone:string)=>{
   if(!phone){
    Alert.alert("Error","Phone number is not available");
    return

   }
    const phoneUrl = `tel:${phone}`;

    try {
       const supported = await Linking.canOpenURL(phoneUrl);

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
  }

  const uploadImage = async (image: any) => {
  try {
    setUploading(true);
    setError("");

    const token = await getToken();

    if (!token) {
      Alert.alert(
        "Authentication Error",
        "Authentication token not available"
      );
      return;
    }

    const formData = new FormData();

    formData.append("file", {
      uri: image.uri,
      name: image.fileName || "lead-image.jpg",
      type: image.mimeType || "image/jpeg",
    } as any);

    console.log("Uploading image...");

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
      "Image uploaded successfully"
    );

    await fetchLeads();

  } catch (error: any) {
    console.log("Image upload error:", error);

    Alert.alert(
      "Upload Failed",
      error?.message || "Unable to upload image"
    );
  } finally {
    setUploading(false);
  }
};


  const handlePickImage = async()=>{
   try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
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

      if (result.canceled) {
      console.log("Image selection cancelled");
      return;
    }

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
  }

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

const confirmDelete = async (leadId: string) => {
  try {
    setError("");

    const token = await getToken();

    if (!token) {
      Alert.alert(
        "Authentication Error",
        "Authentication token not available"
      );
      return;
    }

    const data = await deleteLead(token, leadId);

    console.log("Delete response:", data);

    if (!data.success) {
      throw new Error(
        data.message || "Failed to delete lead"
      );
    }

    // Remove immediately from UI
    setLeads((currentLeads) =>
      currentLeads.filter(
        (lead) => lead.id !== leadId
      )
    );

  } catch (error: any) {
    console.log("Delete lead error:", error);

    Alert.alert(
      "Delete Failed",
      error?.message || "Unable to delete lead"
    );
  }
};

  // -------------------------
  // LOADING SCREEN
  // -------------------------
  if (!isLoaded || loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />

        <Text className="mt-3">
          Loading leads...
        </Text>
      </View>
    );
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <SafeAreaView className="flex-1 bg-gray-50 " >
    <View 
    className="bg-gray-100 pt-4">

      {/* HEADER */}
      <View className="flex-row justify-between items-center px-4 mb-4">

        <Text className="text-2xl font-bold">
          Leads
        </Text>

      <View className="flex-row gap-2">
  <Pressable
    onPress={handlePickCSV}
    disabled={uploading}
    className="bg-blue-600 px-4 py-3 rounded-lg"
  >
    <Text className="text-white font-bold">
      CSV
    </Text>
  </Pressable>

  <Pressable
    onPress={handlePickExcel}
    disabled={uploading}
    className="bg-green-600 px-4 py-3 rounded-lg"
  >
    <Text className="text-white font-bold">
      Excel
    </Text>
  </Pressable>

  <Pressable
    onPress={handlePickImage}
    disabled={uploading}
    className="bg-purple-600 px-4 py-3 rounded-lg"
  >
    <Text className="text-white font-bold">
      Image
    </Text>
  </Pressable>
</View>

      </View>

      {/* ERROR */}
      {error ? (
        <View className="px-4 mb-4">
          <Text className="text-red-500">
            {error}
          </Text>
        </View>
      ) : null}

      {/* EMPTY STATE */}
      {leads.length === 0 ? (
        <View className="flex-1 justify-center items-center">

          <Text className="text-gray-500 mb-4">
            No leads found
          </Text>

          <Pressable
            onPress={handlePickCSV}
            disabled={uploading}
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-bold">
              Import CSV
            </Text>
          </Pressable>

        </View>
      ) : (

        /* TABLE */
        <FlatList
  data={leads}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  }
  renderItem={({ item }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-200">

      {/* Lead information */}
      <View className="mb-4">

        <Text className="text-lg font-bold text-gray-900">
          {item.name || "-"}
        </Text>

        <Text className="text-gray-600 mt-1">
          📞 {item.phone}
        </Text>

        <Text className="text-gray-600 mt-1">
          📍 {item.location || "-"}
        </Text>

      </View>

      {/* Actions */}
      <View className="flex-row gap-3">

        <Pressable
          onPress={() => handleCall(item.phone)}
          className="flex-1 bg-green-600 py-3 rounded-xl items-center"
        >
          <Text className="text-white font-bold">
            📞 Call
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handleDelete(item.id)}
          className="bg-red-500 px-5 py-3 rounded-xl items-center"
        >
          <Text className="text-white font-bold">
            Delete
          </Text>
        </Pressable>

      </View>

    </View>
  )}
/>
      )}

    </View>
    </SafeAreaView>
  );
}