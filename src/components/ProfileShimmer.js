// ProfileShimmer.js
import React from "react";
import { View, StyleSheet } from "react-native";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

export default function ProfileShimmer() {
  return (
    <View style={{ padding: 15 }}>
      {/* Header */}
      <ShimmerPlaceHolder style={styles.profileImage} />
      <ShimmerPlaceHolder style={{ width: 120, height: 20, marginTop: 10 }} />

      {/* Stats */}
      <View style={styles.statsContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View style={styles.card} key={i}>
            <ShimmerPlaceHolder style={{ width: 22, height: 22 }} />
            <ShimmerPlaceHolder style={{ width: 40, height: 20, marginTop: 5 }} />
            <ShimmerPlaceHolder style={{ width: 60, height: 12 }} />
          </View>
        ))}
      </View>

      {/* Quick actions / Account */}
      {[...Array(3)].map((_, i) => (
        <ShimmerPlaceHolder
          key={i}
          style={{ flexDirection: "row", height: 50, borderRadius: 10, marginBottom: 10 }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: "center",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  card: {
    width: "48%",
    height: 80,
    backgroundColor: "#28a745",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
});