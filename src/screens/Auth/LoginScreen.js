import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import useLogin from "../../hooks/auth/useLogin";
import useGoogleLogin from "../../hooks/auth/useGoogleLogin";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useLogin();

  // Google login hook
  const { handleGoogleLogin, googleLoading } = useGoogleLogin();

  // ================= EMAIL LOGIN =================
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password required");
      return;
    }

    try {
      const res = await login({ email, password });

      Alert.alert("Success", "Login successful");

      navigation.replace("Main", {
        screen: "HomeMain",
      });
    } catch (err) {
      Alert.alert("Login Failed", err?.message || "Unable to login");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>

          {/* TITLE */}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          {/* EMAIL */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* PASSWORD */}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          {/* OR */}
          <Text style={styles.or}>OR</Text>

          {/* GOOGLE LOGIN */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator />
            ) : (
              <View style={styles.row}>
                <Icon name="logo-google" size={20} color="#DB4437" />
                <Text style={styles.googleText}>
                  Continue with Google
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* FACEBOOK */}
          <TouchableOpacity
            style={styles.facebookButton}
            onPress={() =>
              Alert.alert("Facebook Login", "Coming soon...")
            }
          >
            <View style={styles.row}>
              <Icon name="logo-facebook" size={20} color="#fff" />
              <Text style={styles.facebookText}>
                Continue with Facebook
              </Text>
            </View>
          </TouchableOpacity>

          {/* REGISTER LINK */}
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text
              style={styles.link}
              onPress={() =>
                navigation.navigate("Register", {
                  screen: "Register",
                })
              }
            >
              Register
            </Text>
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#111",
    marginBottom: 5,
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: 25,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  loginButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  loginText: {
    color: "#fff",
    fontWeight: "600",
  },

  or: {
    textAlign: "center",
    marginVertical: 15,
    color: "#999",
  },

  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  googleText: {
    marginLeft: 10,
    fontWeight: "600",
    color: "#333",
  },

  facebookButton: {
    backgroundColor: "#1877F2",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  facebookText: {
    marginLeft: 10,
    fontWeight: "600",
    color: "#fff",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  footerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },

  link: {
    color: "#28a745",
    fontWeight: "600",
  },
});