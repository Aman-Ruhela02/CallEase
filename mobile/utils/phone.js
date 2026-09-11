import { Alert, Linking } from "react-native";

export const callPhoneNumber = async (phone) => {
  if (!phone) {
    Alert.alert("Error", "Phone number is not available");
    return;
  }
  const phoneUrl = `tel:${phone}`;
  try {
    const supported = await Linking.canOpenURL(phoneUrl);
    if (!supported) {
      Alert.alert("Unable to Call", "This device cannot make phone calls.");
      return;
    }
    await Linking.openURL(phoneUrl);
  } catch (error) {
    console.error("Call error:", error);
    Alert.alert("Error", "Unable to open phone dialer");
  }
};
