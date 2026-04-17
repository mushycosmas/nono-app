import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function AuthModal({ visible, onClose, navigation }) {
  const handleLogin = (type) => {
    onClose();
    // TODO: connect real auth later
    console.log("Login with:", type);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Welcome 👋</Text>
          <Text style={styles.subtitle}>
            Login to continue selling and managing your profile
          </Text>

          {/* Google */}
          <TouchableOpacity
            style={[styles.button, styles.google]}
            onPress={() => handleLogin("google")}
          >
            <Icon name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity
            style={[styles.button, styles.facebook]}
            onPress={() => handleLogin("facebook")}
          >
            <Icon name="logo-facebook" size={20} color="#fff" />
            <Text style={styles.facebookText}>Continue with Facebook</Text>
          </TouchableOpacity>

          {/* Email/Login */}
          <TouchableOpacity
            style={[styles.button, styles.email]}
            onPress={() => {
              onClose();
              navigation.navigate("Auth", { screen: "Login" });
            }}
          >
            <Text style={styles.emailText}>Login with Email / Phone</Text>
          </TouchableOpacity>

          {/* Register */}
          <Text style={styles.footer}>
            Don’t have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => {
                onClose();
                navigation.navigate("Auth", { screen: "Register" });
              }}
            >
              Register
            </Text>
          </Text>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#777",
    marginVertical: 10,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 10,
  },

  google: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  googleText: {
    marginLeft: 10,
    color: "#333",
  },

  facebook: {
    backgroundColor: "#1877F2",
  },
  facebookText: {
    marginLeft: 10,
    color: "#fff",
  },

  email: {
    backgroundColor: "#28a745",
  },
  emailText: {
    color: "#fff",
    fontWeight: "600",
  },

  footer: {
    textAlign: "center",
    marginTop: 15,
    color: "#666",
  },
  link: {
    color: "#28a745",
    fontWeight: "600",
  },

  close: {
    textAlign: "center",
    marginTop: 15,
    color: "#999",
  },
});