// ProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { BASE_URL } from "../config/user";
import NetworkWrapper from "../components/common/NetworkWrapper";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { user, token } = useAuth();

  const USER_ID = user?.id;
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const { logoutUser } = useAuth();
  
  const [stats, setStats] = useState({
    ads: 0,
    views: 0,
    messages: 0,
    sold: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  // 🔥 Build full image URL
  const getFullImage = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `https://nono.co.tz${path}`;
  };

  const fetchAll = async () => {
    try {
      // 🔹 Fetch user
       const userRes = await fetch(`${BASE_URL}/get_user/${USER_ID}`, {
       headers: {
       Authorization: `Bearer ${token}`,
      }, 
      });
      const userData = await userRes.json();
      const user = userData.user || userData;

      setUserName(
        `${user.first_name || ""} ${user.last_name || ""}`.trim()
      );
      setAvatar(getFullImage(user.avatar_url));

      // 🔹 Fetch stats
      const statsRes = await fetch(
        `${BASE_URL}/seller/stats?sellerId=${USER_ID}`
      );
      const statsData = await statsRes.json();

      setStats({
        ads: statsData.totalAds || 0,
        views: statsData.totalViews || 0,
        messages: statsData.totalMessages || 0,
        sold: 0,
      });
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

 
  const handleLogout = () => {
  Alert.alert("Logout", "Are you sure?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Logout",
      style: "destructive",
      onPress: async () => {
        await logoutUser();

        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      },
    },
  ]);
};

  // 🔄 Shimmer
  const ProfileShimmer = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ShimmerPlaceHolder style={styles.profileImage} />
        <ShimmerPlaceHolder style={{ width: 120, height: 20, marginTop: 10 }} />
      </View>
    </ScrollView>
  );

  if (loading) return <ProfileShimmer />;

  return (
    <NetworkWrapper>
       <ScrollView style={styles.container}>
      {/* 🔥 HEADER */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              avatar ||
              `https://ui-avatars.com/api/?name=${userName}&background=28a745&color=fff`,
          }}
          style={styles.profileImage}
          onError={() => console.log("Image failed:", avatar)}
        />

        <Text style={styles.userName}>
          {userName || "User"}
        </Text>
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

      {/* 🔥 ACCOUNT */}
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
    </NetworkWrapper>
   
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
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#28a745",
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
});