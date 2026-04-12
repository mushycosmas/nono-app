import React from "react";
import { View, Text, TextInput } from "react-native";

export default function ProductFormSection({ form, setForm, styles }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.price}
        onChangeText={(text) => setForm({ ...form, price: text })}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
      />

      {/* <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={form.location}
        onChangeText={(text) => setForm({ ...form, location: text })}
      /> */}
    </View>
  );
}