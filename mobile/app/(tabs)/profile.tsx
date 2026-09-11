import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { isLoaded, isSignedIn, userId, signOut, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  // -------------------------
  // LOGOUT
  // -------------------------
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            //console.log("User logged out successfully");
            router.replace("/(auth)/sign-in");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Unable to logout");
          }
        },
      },
    ]);
  };

  // -------------------------
  // TEMP TOKEN TEST
  // -------------------------
  const getClerkToken = async () => {
    const token = await getToken();
    if (!token) {
      //console.log("Token not available");
      return;
    }
    //console.log("CLERK TOKEN:", token);
  };

  // -------------------------
  // LOADING
  // -------------------------
  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" />

        <Text className="mt-3 text-gray-500">Loading profile...</Text>
      </View>
    );
  }

  // -------------------------
  // NOT SIGNED IN
  // -------------------------
  if (!isSignedIn) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Text className="text-xl font-bold mb-3">You are not signed in</Text>

        <Pressable
          onPress={() => router.replace("/(auth)/sign-in")}
          className="bg-blue-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Go to Sign In</Text>
        </Pressable>
      </View>
    );
  }

  // -------------------------
  // USER DATA
  // -------------------------
  const name = user?.fullName || "User";
  const email = user?.primaryEmailAddress?.emailAddress || "No email";
  const initial = name.charAt(0).toUpperCase();
  // -------------------------
  // UI
  // -------------------------
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        // className="flex-1 "
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900">Profile</Text>

          <Text className="text-gray-500 mt-1">
            Manage your CallEase account
          </Text>
        </View>

        {/* PROFILE CARD */}
        <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
          <View className="items-center">
            {/* AVATAR */}
            <View className="w-24 h-24 rounded-full bg-blue-600 items-center justify-center mb-4">
              <Text className="text-white text-4xl font-bold">{initial}</Text>
            </View>

            {/* NAME */}
            <Text className="text-2xl font-bold text-gray-900">{name}</Text>

            {/* EMAIL */}
            <Text className="text-gray-500 mt-1">{email}</Text>
          </View>
        </View>

        {/* ACCOUNT INFORMATION */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Account</Text>

        <View className="bg-white rounded-2xl overflow-hidden mb-6">
          {/* NAME */}
          <View className="px-5 py-4 border-b border-gray-100">
            <Text className="text-sm text-gray-400">Name</Text>

            <Text className="text-base font-semibold text-gray-900 mt-1">
              {name}
            </Text>
          </View>

          {/* EMAIL */}
          <View className="px-5 py-4 border-b border-gray-100">
            <Text className="text-sm text-gray-400">Email</Text>

            <Text className="text-base font-semibold text-gray-900 mt-1">
              {email}
            </Text>
          </View>

          {/* USER ID */}
          <View className="px-5 py-4">
            <Text className="text-sm text-gray-400">Account ID</Text>

            <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>
              {userId}
            </Text>
          </View>
        </View>

        {/* SETTINGS */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Settings</Text>

        <View className="bg-white rounded-2xl overflow-hidden mb-6">
          <Pressable
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Account settings will be available soon.",
              )
            }
            className="px-5 py-4 border-b border-gray-100"
          >
            <Text className="text-base font-semibold text-gray-900">
              Account Settings
            </Text>

            <Text className="text-sm text-gray-500 mt-1">
              Manage your account information
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Subscription management will be available soon.",
              )
            }
            className="px-5 py-4"
          >
            <Text className="text-base font-semibold text-gray-900">
              Subscription
            </Text>

            <Text className="text-sm text-gray-500 mt-1">
              Manage your CallEase subscription
            </Text>
          </Pressable>
        </View>

        {/* LOGOUT */}
        <Pressable
          onPress={handleLogout}
          className="bg-red-600 rounded-xl py-4 items-center"
        >
          <Text className="text-white font-bold text-base">Logout</Text>
        </Pressable>

        {/* TEMPORARY TOKEN TEST */}
        {/* Keep this only during development */}
        <Pressable onPress={getClerkToken} className="mt-5 items-center">
          <Text className="text-xs text-gray-400">Developer: Get Token</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
