import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function Header() {
  return (
    <View
      style={{
        height: 60,
        backgroundColor: "#FFD700", // gold theme like your website
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Nono Store</Text>
    </View>
  );
}