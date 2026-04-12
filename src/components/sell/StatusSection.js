import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function StatusSection({ form, setForm, styles }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Status</Text>
      <View style={styles.row}>
        {["active", "inactive"].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, form.status === s && styles.chipActive]}
            onPress={() => setForm({ ...form, status: s })}
          >
            <Text style={form.status === s && { color: "#fff" }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}