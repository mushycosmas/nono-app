import { useState } from "react";
import { Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

GoogleSignin.configure({
  webClientId:
    "711757867392-nhaifv485s7m1ejnthm4b2dkig0u893u.apps.googleusercontent.com",
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export default function useGoogleLogin() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigation = useNavigation();

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      await GoogleSignin.hasPlayServices();

      // 🔥 force account chooser (important)
      await GoogleSignin.signOut();

      // 🔥 SIGN IN
      const userInfo = await GoogleSignin.signIn();

      //console.log("🔥 USER INFO:", userInfo);

      // 🔥 GET TOKENS (THIS IS THE FIX)
      const tokens = await GoogleSignin.getTokens();

      console.log("🔥 TOKENS:", tokens);

      const accessToken = tokens.accessToken;

      if (!accessToken) {
        Alert.alert("Error", "No access token received");
        return;
      }

      // 🔥 SEND TO BACKEND
      const res = await fetch(
        "https://nono.co.tz/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
          }),
        }
      );

      const data = await res.json();

      console.log("🔥 BACKEND RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.message || "Google login failed");
      }

      await loginUser(data);

      navigation.reset({
        index: 0,
        routes: [{ name: "Main", params: { screen: "HomeMain" } }],
      });

    } catch (err) {
      console.log("❌ Google Login Error:", err);
      Alert.alert("Google Login Failed", err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return {
    handleGoogleLogin,
    googleLoading,
  };
}