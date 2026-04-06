import React from "react";
import { View, StyleSheet } from "react-native";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

export default function CategoryCardShimmer() {
  return (
    <View style={styles.card}>
      <ShimmerPlaceHolder style={styles.icon} />
      <ShimmerPlaceHolder style={styles.name} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 8,
  },
  name: {
    width: "80%",
    height: 12,
    borderRadius: 4,
  },
});