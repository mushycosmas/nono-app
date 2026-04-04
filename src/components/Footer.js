import React from "react";
import { View, Text, Linking, TouchableOpacity } from "react-native";

export default function Footer() {
  const whatsappUrl = "https://wa.me/255700000000"; // Replace with your number
  return (
    <View
      style={{
        height: 60,
        backgroundColor: "#FFD700",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={() => Linking.openURL(whatsappUrl)}>
        <Text style={{ fontSize: 16 }}>Order via WhatsApp</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 14, marginTop: 5 }}>© 2026 Nono Store</Text>
    </View>
  );
}