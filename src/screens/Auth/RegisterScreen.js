import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

export default function RegisterScreen({ navigation, route }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const redirectTo = route?.params?.redirectTo;

    Alert.alert("Success", "Registered successfully");

    navigation.replace(redirectTo || "Home");
  };

  const handleSocialLogin = (provider) => {
    Alert.alert(`${provider} Login`, "Coming soon...");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join and start selling today</Text>

      {/* Inputs */}
      <TextInput
        placeholder="Email address"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Primary Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* Google Login */}
      <TouchableOpacity
        style={[styles.socialButton, styles.googleButton]}
        onPress={() => handleSocialLogin("Google")}
      >
        <Icon name="logo-google" size={20} color="#DB4437" />
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Facebook Login */}
      <TouchableOpacity
        style={[styles.socialButton, styles.facebookButton]}
        onPress={() => handleSocialLogin("Facebook")}
      >
        <Icon name="logo-facebook" size={20} color="#fff" />
        <Text style={styles.facebookText}>Continue with Facebook</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.replace("Login")}
        >
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#111",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: 30,
    marginTop: 5,
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },

  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },

  or: {
    marginHorizontal: 10,
    color: "#999",
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: "center",
    gap: 10,
  },

  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  googleText: {
    color: "#333",
    fontWeight: "500",
  },

  facebookButton: {
    backgroundColor: "#1877F2",
  },

  facebookText: {
    color: "#fff",
    fontWeight: "500",
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