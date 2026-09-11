import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/expo";
import "../../global.css";

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  // Wait for Clerk to load
  if (!isLoaded) {
    return null;
  }
  // User is not authenticated
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  // User is authenticated → show tabs
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="leads"
        options={{
          title: "Leads",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
