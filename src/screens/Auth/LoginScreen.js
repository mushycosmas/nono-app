import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import useLogin from "../../hooks/auth/useLogin";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading } = useLogin();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const res = await login({ email, password });

      Alert.alert("Success", "Logged in successfully");

      console.log("TOKEN:", res.token);
      console.log("USER:", res.user);
    } catch (err) {
      Alert.alert("Login Failed", err.message);
    }
  };

  const goHome = () => {
    navigation.navigate("Main", {
      screen: "HomeMain",
    });
  };

  const handleSocialLogin = (type) => {
    Alert.alert(`${type} Login`, "Coming soon...");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goHome}>
            <Icon name="arrow-back" size={26} color="#111" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Login</Text>

          <View style={{ width: 26 }} />
        </View>

        <Text style={styles.subtitle}>Welcome back</Text>

        {/* EMAIL */}
        <TextInput
          placeholder="Email address"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* PASSWORD */}
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* FORGOT PASSWORD */}
        <TouchableOpacity
          onPress={() => Alert.alert("Reset Password", "Feature coming soon")}
        >
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        {/* CONTINUE AS GUEST */}
        <TouchableOpacity style={styles.guestButton} onPress={goHome}>
          <Icon name="home-outline" size={18} color="#28a745" />
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>

        {/* DIVIDER */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* GOOGLE */}
        <TouchableOpacity
          style={[styles.socialButton, styles.google]}
          onPress={() => handleSocialLogin("Google")}
        >
          <Icon name="logo-google" size={20} color="#DB4437" />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* FACEBOOK */}
        <TouchableOpacity
          style={[styles.socialButton, styles.facebook]}
          onPress={() => handleSocialLogin("Facebook")}
        >
          <Icon name="logo-facebook" size={20} color="#fff" />
          <Text style={styles.facebookText}>Continue with Facebook</Text>
        </TouchableOpacity>

        {/* REGISTER */}
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text
            style={styles.link}
            onPress={() =>
              navigation.navigate("Main", {
                screen: "Register",
              })
            }
          >
            Register
          </Text>
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FAFAFA",
    flexGrow: 1,
    justifyContent: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
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

  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 15,
  },

  forgot: {
    textAlign: "right",
    color: "#28a745",
    marginBottom: 10,
    fontWeight: "500",
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

  guestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    gap: 8,
  },

  guestText: {
    color: "#28a745",
    fontWeight: "600",
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

  google: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  googleText: {
    color: "#333",
    fontWeight: "500",
  },

  facebook: {
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