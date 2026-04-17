import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as Network from "expo-network";
import { Ionicons } from "@expo/vector-icons";

export default function NetworkWrapper({ children }) {
  const [isConnected, setIsConnected] = useState(null);

  const checkConnection = async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      const connected =
        state.isConnected && state.isInternetReachable !== false;

      setIsConnected(connected);
    } catch (e) {
      console.log("Network error:", e);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkConnection();

    const interval = setInterval(checkConnection, 3000);

    return () => clearInterval(interval);
  }, []);

  // ⏳ Initial loading
  if (isConnected === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Checking connection...</Text>
      </View>
    );
  }

  // ❌ No Internet → BLOCK APP
  if (!isConnected) {
    return (
      <View style={styles.center}>
        <Ionicons name="cloud-offline-outline" size={80} color="gray" />
        <Text style={styles.text}>No Internet Connection</Text>
        <Text style={styles.subText}>
          Please check your connection and try again
        </Text>
      </View>
    );
  }

  // ✅ Internet → show app
  return children;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginTop: 15,
    fontWeight: "bold",
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});