import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function CategorySection({
  navigation,
  category,
  subcategory,
  loadingCategories,
  styles,
}) {
  return (
    <View style={styles.card}>
      {loadingCategories ? (
        <ActivityIndicator size="small" color="#28a745" />
      ) : (
        <TouchableOpacity
          style={styles.input}
          onPress={() =>
            navigation.navigate("CategorySelect", {
              returnScreen: "SellScreen",
            })
          }
        >
          <Text>
            {category
              ? `${category.name} > ${subcategory?.name}`
              : "Select Category"}
          </Text>
          <Icon name="chevron-down" size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
}