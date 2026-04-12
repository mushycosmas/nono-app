import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function LocationSection({ form, setForm, styles }) {
  return (
    <View style={[styles.card, { marginBottom: 12 }]}>
      <Text style={styles.label}>Location</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Kariakoo, Madukani, Sinoni"
        value={form?.location || ""}
        onChangeText={(text) =>
          setForm((prev) => ({
            ...prev,
            location: text,
          }))
        }
      />

      <Text style={localStyles.hint}>
        Enter your physical location manually
      </Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  hint: {
    fontSize: 11,
    color: "#888",
    marginTop: 5,
  },
});