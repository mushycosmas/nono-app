import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
        onPress={() => navigation.navigate("LocationSelect")}
      >
        <Text>
          {location
            ? location.name 
            : "Select Location"}
        </Text>

        <Icon name="location-outline" size={20} />
      </TouchableOpacity>
    </View>
  );
}