import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const API_URL = "http://192.168.1.10:3000";

export default function Signup() {
  const { signUp, errors } = useSignUp();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [code, setCode] = useState("");
  const [verificationStarted, setVerificationStarted] =
    useState(false);

  const [loading, setLoading] = useState(false);

  // -------------------------
  // STEP 1: CREATE CLERK SIGNUP
  // -------------------------
  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      console.log("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const signupResult = await signUp.password({
        emailAddress: email.trim(),
        password,
      });

      console.log("Password signup result:", signupResult);
      console.log("Signup status:", signUp.status);

      if (signupResult.error) {
        console.log(
          "Password signup error:",
          JSON.stringify(signupResult.error, null, 2)
        );

        return;
      }

      // Send verification code
      const emailResult =
        await signUp.verifications.sendEmailCode();

      console.log(
        "Email verification result:",
        emailResult
      );

      if (emailResult.error) {
        console.log(
          "Email code error:",
          JSON.stringify(emailResult.error, null, 2)
        );

        return;
      }

      console.log("Verification code sent");

      setVerificationStarted(true);

    } catch (error: any) {
      console.log(
        "Signup exception:",
        JSON.stringify(error, null, 2)
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // STEP 2: VERIFY EMAIL
  // -------------------------
  const handleVerification = async () => {
    if (!code.trim()) {
      console.log("Please enter verification code");
      return;
    }

    try {
      setLoading(true);

      const result =
        await signUp.verifications.verifyEmailCode({
          code: code.trim(),
        });

      console.log("Verification result:", result);

      if (result.error) {
        console.log(
          "Verification error:",
          JSON.stringify(result.error, null, 2)
        );

        return;
      }

      console.log("Verification accepted");
      console.log("Signup status:", signUp.status);

      if (signUp.status !== "complete") {
        console.log(
          "Signup is not complete:",
          signUp.status
        );

        return;
      }

      // -------------------------
      // STEP 3: FINALIZE CLERK
      // -------------------------
      await signUp.finalize({
        navigate: async ({ session }) => {
          console.log("Session:", session?.id);

          // Get Clerk token
          const token = await session?.getToken();

          console.log(
            "Token exists:",
            !!token
          );

          if (!token) {
            throw new Error(
              "Clerk session token not available"
            );
          }

          console.log("token...",token);
          

          // -------------------------
          // STEP 4: CREATE SUPABASE PROFILE
          // -------------------------
          const response = await fetch(
            `${API_URL}/api/profile`,
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                name: name.trim(),
                email: email.trim(),
              }),
            }
          );

          const data = await response.json();

          console.log(
            "Create profile response:",
            data
          );

          if (!response.ok || !data.success) {
            throw new Error(
              data.message ||
              "Failed to create profile"
            );
          }

          console.log(
            "Profile created successfully"
          );

          // -------------------------
          // STEP 5: GO TO HOME
          // -------------------------
          router.replace("/home");
        },
      });

    } catch (error: any) {
      console.log(
        "Verification exception:",
        JSON.stringify(error, null, 2)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6">

      {!verificationStarted ? (
        <>
          <Text className="text-3xl font-bold mb-6">
            Create Account
          </Text>

          {/* NAME */}
          <TextInput
            placeholder="Full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            className="border p-4 rounded-lg mb-4"
          />

          {/* EMAIL */}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="border p-4 rounded-lg mb-4"
          />

          {/* PASSWORD */}
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="border p-4 rounded-lg mb-4"
          />

          <Pressable
            onPress={handleSignup}
            disabled={loading}
            className="bg-blue-600 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold">
              {loading
                ? "Creating account..."
                : "Create Account"}
            </Text>
          </Pressable>

          <Link
            href="/sign-in"
            className="text-center mt-5"
          >
            Already have an account? Login
          </Link>
        </>
      ) : (
        <>
          <Text className="text-3xl font-bold mb-3">
            Verify Email
          </Text>

          <Text className="mb-6">
            Enter the verification code sent to your email.
          </Text>

          <TextInput
            placeholder="Verification code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            className="border p-4 rounded-lg mb-4"
          />

          <Pressable
            onPress={handleVerification}
            disabled={loading}
            className="bg-blue-600 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold">
              {loading
                ? "Verifying..."
                : "Verify Email"}
            </Text>
          </Pressable>
        </>
      )}

      {Array.isArray(errors) &&
        errors[0]?.message ? (
        <Text className="text-red-500 mt-4">
          {errors[0].message}
        </Text>
      ) : null}

    </View>
  );
}