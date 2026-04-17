import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function RegisterScreen({ navigation, route }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
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

    console.log({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    Alert.alert("Success", "Account created successfully");

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
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Main", {
          screen: "HomeMain",
          })}>
            <Icon name="arrow-back" size={26} color="#111" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create Account</Text>

          <View style={{ width: 26 }} />
        </View>

        <Text style={styles.subtitle}>Join and start selling today</Text>

        {/* ================= NAME ================= */}
        <View style={styles.row}>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#999"
            style={[styles.input, styles.half]}
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#999"
            style={[styles.input, styles.half]}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* ================= EMAIL ================= */}
        <TextInput
          placeholder="Email address"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* ================= PHONE ================= */}
        <TextInput
          placeholder="Phone number"
          placeholderTextColor="#999"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* ================= PASSWORD ================= */}
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

        {/* ================= CONFIRM PASSWORD ================= */}
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            style={styles.passwordInput}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* ================= BUTTON ================= */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        {/* ================= DIVIDER ================= */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* ================= GOOGLE ================= */}
        <TouchableOpacity
          style={[styles.socialButton, styles.google]}
          onPress={() => handleSocialLogin("Google")}
        >
          <Icon name="logo-google" size={20} color="#DB4437" />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* ================= FACEBOOK ================= */}
        <TouchableOpacity
          style={[styles.socialButton, styles.facebook]}
          onPress={() => handleSocialLogin("Facebook")}
        >
          <Icon name="logo-facebook" size={20} color="#fff" />
          <Text style={styles.facebookText}>Continue with Facebook</Text>
        </TouchableOpacity>

        {/* ================= LOGIN LINK ================= */}
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.replace("Login")}
          >
            Login
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
    marginBottom: 25,
    marginTop: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },

  half: {
    width: "48%",
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