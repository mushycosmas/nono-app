import React from "react";
import { View, Text } from "react-native";

import GoogleLogin from "../../components/Auth/GoogleLogin";

export default function LoginScreen() {
  return (
    <View style={{ marginTop: 100 }}>
      <Text>Login Page</Text>

      {/* ✅ USE IT HERE */}
      <GoogleLogin />
    </View>
  );
}