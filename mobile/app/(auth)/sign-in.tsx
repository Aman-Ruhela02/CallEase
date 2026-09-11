import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function SignIn() {
  const { signIn, errors } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleSignIn = async () => {
    try {
      if (!email || !password) {
        return;
      }
      const { error } = await signIn.password({
        identifier: email,
        password,
      });
      if (error) {
        console.error("Sign in error:", JSON.stringify(error, null, 2));
        return;
      }
      //console.log("Sign in status:", signIn.status);
      // -------------------------
      // SIGN IN COMPLETE
      // -------------------------
      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: async ({ session }) => {
            //console.log("Session:", session?.id);

            router.replace("/(tabs)/home");
          },
        });
        return;
      }
      // -------------------------
      // CLIENT TRUST REQUIRED
      // -------------------------
      if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code",
        );
        if (!emailCodeFactor) {
          //console.log("Email verification factor is not available");
          return;
        }
        const { error } = await signIn.mfa.sendEmailCode();
        if (error) {
          console.log(
            "Send client trust code error:",
            JSON.stringify(error, null, 2),
          );
          return;
        }
        setShowCodeInput(true);
        //console.log("Client trust verification code sent");
      }
    } catch (error) {
      console.error("Sign in error:", JSON.stringify(error, null, 2));
    }
  };
  // -------------------------
  // VERIFY CLIENT TRUST CODE
  // -------------------------
  const handleVerifyCode = async () => {
    try {
      if (!code) {
        return;
      }
      const { error } = await signIn.mfa.verifyEmailCode({
        code,
      });
      if (error) {
        console.error("Verification error:", JSON.stringify(error, null, 2));
        return;
      }
      //console.log("Verification status:", signIn.status);
      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: async ({ session }) => {
            //console.log("Session:", session?.id);
            router.replace("/(tabs)/home");
          },
        });
      }
    } catch (error) {
      console.error("Verify code error:", JSON.stringify(error, null, 2));
    }
  };

  return (
    <View className="flex-1 justify-center px-6">
      <Text className="text-3xl font-bold mb-6">Welcome Back</Text>

      {!showCodeInput ? (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            className="border p-4 rounded-lg mb-4"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="border p-4 rounded-lg mb-2"
          />

          <Link href="/(auth)/forgot-password" className="text-right mb-5">
            Forgot Password?
          </Link>

          <Pressable
            onPress={handleSignIn}
            className="bg-blue-600 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold">Sign In</Text>
          </Pressable>

          <Link href="/(auth)/sign-up" className="text-center mt-5">
            Don't have an account? Sign Up
          </Link>
        </>
      ) : (
        <>
          <Text className="text-gray-600 mb-4">
            We sent a verification code to:
          </Text>

          <Text className="font-bold mb-5">{email}</Text>

          <TextInput
            placeholder="Enter verification code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            className="border p-4 rounded-lg mb-4"
          />

          <Pressable
            onPress={handleVerifyCode}
            className="bg-blue-600 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold">Verify</Text>
          </Pressable>
        </>
      )}

      {Array.isArray(errors) && errors[0]?.message ? (
        <Text className="text-red-500 mt-4">{errors[0].message}</Text>
      ) : null}
    </View>
  );
}
