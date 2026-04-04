import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { USER_ID, BASE_URL } from "../config/user";

export default function ProfileScreen({ navigation }) {
  const [userName] = useState("John Doe");

  const [stats, setStats] = useState({
    ads: 0,
    views: 0,
    messages: 0,
    sold: 0,
  });

  const [loading, setLoading] = useState(true);

  // 🔥 Fetch stats
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/seller/stats?sellerId=${USER_ID}`
      );

      if (!res.ok) throw new Error("Failed to fetch stats");

      const data = await res.json();

      setStats({
        ads: data.totalAds || 0,
        views: data.totalViews || 0,
        messages: data.totalMessages || 0,
        sold: 0, // optional (you can add later from API)
      });
    } catch (error) {
      console.log("Stats Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel" },
      { text: "Logout", onPress: () => navigation.replace("Home") },
    ]);
  };

  // 🔄 Loading
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 🔥 HEADER */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://placekitten.com/200/200" }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {/* 🔥 STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.card}>
          <Icon name="cube-outline" size={22} color="#fff" />
          <Text style={styles.cardNumber}>{stats.ads}</Text>
          <Text style={styles.cardLabel}>Ads</Text>
        </View>

        <View style={styles.card}>
          <Icon name="eye-outline" size={22} color="#fff" />
          <Text style={styles.cardNumber}>{stats.views}</Text>
          <Text style={styles.cardLabel}>Views</Text>
        </View>

        <View style={styles.card}>
          <Icon name="chatbubble-outline" size={22} color="#fff" />
          <Text style={styles.cardNumber}>{stats.messages}</Text>
          <Text style={styles.cardLabel}>Messages</Text>
        </View>

        <View style={styles.card}>
          <Icon name="checkmark-done-outline" size={22} color="#fff" />
          <Text style={styles.cardNumber}>{stats.sold}</Text>
          <Text style={styles.cardLabel}>Sold</Text>
        </View>
      </View>

      {/* 🔥 QUICK ACTIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Sell")}
        >
          <Icon name="add-circle-outline" size={22} color="#28a745" />
          <Text style={styles.menuText}>Post New Ad</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("MyAds")}
        >
          <Icon name="list-outline" size={22} color="#f39c12" />
          <Text style={styles.menuText}>My Ads</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Messages")}
        >
          <Icon name="chatbubbles-outline" size={22} color="#007bff" />
          <Text style={styles.menuText}>Messages</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 SETTINGS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Settings")}
        >
          <Icon name="settings-outline" size={22} color="#555" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Icon name="log-out-outline" size={22} color="#dc3545" />
          <Text style={[styles.menuText, { color: "#dc3545" }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 15,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  card: {
    width: "48%",
    backgroundColor: "#28a745",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },

  cardNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },

  cardLabel: {
    color: "#fff",
    fontSize: 13,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  menuText: {
    fontSize: 15,
    marginLeft: 10,
    fontWeight: "600",
  },
  loader: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},
});