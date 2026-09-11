import { useAuth } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import { uploadCSV, uploadExcel, uploadImage } from "../services/upload.api.js";

export default function useLeadUpload(options = {}) {
  const { getToken } = useAuth();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const getAuthToken = async () => {
    const token = await getToken();

    if (!token) {
      Alert.alert("Authentication Error", "Authentication token not available");
      throw new Error("Authentication token not available");
    }
    return token;
  };

  // =========================
  // CSV
  // =========================

  const pickCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (result.canceled) {
        return;
      }
      const file = result.assets[0];
      if (!file.name || !file.name.toLowerCase().endsWith(".csv")) {
        Alert.alert("Invalid file", "Please select a CSV file.");
        return;
      }
      await uploadCSVFile(file);
    } catch (error) {
      //console.log("CSV picker error:", error);
      if (error?.message !== "Authentication token not available") {
        Alert.alert("Error", "Unable to select CSV file");
      }
    }
  };

  const uploadCSVFile = async (file) => {
    try {
      setUploading(true);
      setError("");
      const token = await getAuthToken();
      const data = await uploadCSV(token, file);
      if (!data.success) {
        throw new Error(data.message || "CSV upload failed");
      }
      Alert.alert("Success", `${data.count} leads imported successfully`);
      await options.onSuccess?.();
      return data;
    } catch (error) {
      //console.log("CSV upload error:", error);
      setError(error?.message || "Unable to upload CSV");
      Alert.alert("Upload Failed", error?.message || "Unable to upload CSV");
      throw error;
    } finally {
      setUploading(false);
    }
  };
  // =========================
  // EXCEL
  // =========================
  const pickExcel = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ],
        copyToCacheDirectory: true,
      });
      if (result.canceled) {
        return;
      }
      const file = result.assets[0];
      const fileName = file.name?.toLowerCase() || "";
      if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
        Alert.alert(
          "Invalid file",
          "Please select an Excel file (.xlsx or .xls).",
        );
        return;
      }
      await uploadExcelFile(file);
    } catch (error) {
      console.error("Excel picker/upload error:", error);
      // Don't show another misleading
      // "Unable to select file" alert here.
    }
  };

  const uploadExcelFile = async (file) => {
    try {
      setUploading(true);
      setError("");
      const token = await getAuthToken();
      const data = await uploadExcel(token, file);
      if (!data.success) {
        throw new Error(data.message || "Excel upload failed");
      }
      Alert.alert("Success", `${data.count} leads imported successfully`);
      await options.onSuccess?.();
      return data;
    } catch (error) {
      //console.log("Excel upload error:", error);
      setError(error?.message || "Unable to upload Excel");
      Alert.alert("Upload Failed", error?.message || "Unable to upload Excel");
      throw error;
    } finally {
      setUploading(false);
    }
  };
  // =========================
  // IMAGE
  // =========================
  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photos.",
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });
      if (result.canceled) {
        return;
      }
      const image = result.assets[0];
      await uploadImageFile(image);
    } catch (error) {
      //console.log("Image picker error:", error);
      if (error?.message !== "Authentication token not available") {
        Alert.alert("Error", "Unable to select image");
      }
    }
  };

  const uploadImageFile = async (image) => {
    try {
      setUploading(true);
      setError("");
      const token = await getAuthToken();
      const data = await uploadImage(token, image);
      if (!data.success) {
        throw new Error(data.message || "Image upload failed");
      }
      Alert.alert("Success", "Image uploaded successfully");
      await options.onSuccess?.();
      return data;
    } catch (error) {
      //console.log("Image upload error:", error);
      setError(error?.message || "Unable to upload image");
      Alert.alert("Upload Failed", error?.message || "Unable to upload image");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    error,
    pickCSV,
    pickExcel,
    pickImage,
    uploadCSVFile,
    uploadExcelFile,
    uploadImageFile,
  };
}
