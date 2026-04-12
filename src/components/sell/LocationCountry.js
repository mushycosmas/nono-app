import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
export default function LocationCountry({
  navigation,
  location,
  styles,
}) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.input}
        onPress={() =>
          navigation.navigate("LocationSelect", {
            returnScreen: "Sell",
          })
        }
      >
        <Text>
          {location
            ? `${location.country?.name || ""} > ${location.region?.name || ""} > ${location.district?.name || "Select Location"}`
            : "Select Location"}
        </Text>

        <Icon name="location-outline" size={20} />
      </TouchableOpacity>
    </View>
  );
}