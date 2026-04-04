import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "382651467340-eeocmcde2e4df76s79f8po4dtgurro1t.apps.googleusercontent.com",
  });

  // 🔥 Check if user already logged in
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        console.log("Auto login success");
        navigation.replace("Home"); // go dashboard directly
      }
    } catch (e) {
      console.log("Error checking user", e);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Handle Google response
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;

      if (authentication?.accessToken) {
        getUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  // 🔥 Get user info from Google
  const getUserInfo = async (token) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await res.json();

      console.log("Google User:", user);

      // 🔥 OPTIONAL: Send to backend
      // const apiRes = await fetch("https://yourapi.com/google-login", {...})

      // 🔥 Save user locally
      await AsyncStorage.setItem("user", JSON.stringify(user));

      // 🔥 Navigate to dashboard
      navigation.replace("Home");
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  // 🔄 Loading screen
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#4285F4",
          padding: 15,
          borderRadius: 10,
        }}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          Continue with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
}