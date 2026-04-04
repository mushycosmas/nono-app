import React from "react";
import { View, Text } from "react-native";

export default function CartScreen() {
  return (
    <View style={{ flex: 1, padding: 10, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Your cart is empty for now.</Text>
    </View>
  );
}