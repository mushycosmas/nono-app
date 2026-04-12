import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function WholesalePriceSection({
  wholesaleTiers,
  addTier,
  updateTier,
  removeTier,
  styles,
}) {
  if (!wholesaleTiers) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Wholesale Tiers</Text>

      {wholesaleTiers.map((item, index) => (
        <View key={index} style={styles.tierRow}>
          <TextInput
            style={styles.tierInput}
            placeholder="Min"
            keyboardType="numeric"
            value={item.min_qty?.toString() || ""}
            onChangeText={(v) => updateTier(index, "min_qty", v)}
          />

          <TextInput
            style={styles.tierInput}
            placeholder="Max"
            keyboardType="numeric"
            value={item.max_qty?.toString() || ""}
            onChangeText={(v) => updateTier(index, "max_qty", v)}
          />

          <TextInput
            style={styles.tierInput}
            placeholder="Price"
            keyboardType="numeric"
            value={item.whole_seller_price || ""}
            onChangeText={(v) =>
              updateTier(index, "whole_seller_price", v)
            }
          />

          <TouchableOpacity onPress={() => removeTier(index)}>
            <Icon name="close-circle" size={22} color="#dc3545" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={addTier}>
        <Text style={{ color: "#28a745", marginTop: 5 }}>
          + Add Tier
        </Text>
      </TouchableOpacity>
    </View>
  );
}