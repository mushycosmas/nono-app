import React from "react";
import { View, Text, Button, Linking } from "react-native";

export default function ContactScreen() {
  const whatsappUrl = "https://wa.me/255700000000"; // replace with your number
  return (
    <View style={{ flex: 1, padding: 10, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Contact Us</Text>
      <Button title="Chat on WhatsApp" onPress={() => Linking.openURL(whatsappUrl)} />
    </View>
  );
}