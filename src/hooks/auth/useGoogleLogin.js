import { useState } from "react";
import { Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

// Configure ONCE (you can later move this to app entry)
GoogleSignin.configure({
  webClientId:
    "711757867392-nhaifv485s7m1ejnthm4b2dkig0u893u.apps.googleusercontent.com",
  offlineAccess: true,
});

export default function useGoogleLogin() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigation = useNavigation(); // ✅ FIX HERE

const handleGoogleLogin = async () => {
  try {
    setGoogleLoading(true);

    await GoogleSignin.hasPlayServices();

    // 🔥 force account chooser
    await GoogleSignin.signOut();

    const userInfo = await GoogleSignin.signIn();

    const idToken = userInfo.data?.idToken;

    if (!idToken) {
      Alert.alert("Error", "No ID Token received");
      return;
    }

    const res = await fetch("https://nono.co.tz/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    await loginUser(data);

    navigation.replace("Main", { screen: "HomeMain" });

  } catch (err) {
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