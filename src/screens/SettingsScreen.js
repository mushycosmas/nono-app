// SettingsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { USER_ID, BASE_URL } from "../config/user";

export default function SettingsScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("Dodoma");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [loading, setLoading] = useState(true);

  // ✅ Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/get_user/${USER_ID}`);
      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      const user = data.user || data;

      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setLocation(user.location || "Dodoma");
      setPhone(user.phone || "");
      setEmail(user.email || "");

      if (user.avatar_url) setAvatar(user.avatar_url);
    } catch (error) {
      console.log("Fetch Error:", error);
      Alert.alert("Error", "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${BASE_URL}/save-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: USER_ID, firstName, lastName, location, phone, email }),
      });

      const data = await res.json();
      if (res.ok) Alert.alert("Success", "Profile updated successfully");
      else Alert.alert("Error", data.message || "Failed to save");
    } catch (error) {
      console.log("Save Error:", error);
      Alert.alert("Error", "Network error");
    }
  };

  // 🔄 Shimmer Placeholder while loading
  const SettingsShimmer = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Personal Details</Text>

      <View style={styles.avatarContainer}>
        <ShimmerPlaceHolder style={styles.avatar} />
        <ShimmerPlaceHolder style={{ width: 80, height: 25, borderRadius: 6, marginTop: 10 }} />
      </View>

      {[...Array(5)].map((_, i) => (
        <ShimmerPlaceHolder
          key={i}
          style={{ height: 45, borderRadius: 8, marginBottom: 10 }}
        />
      ))}

      <ShimmerPlaceHolder style={{ height: 50, borderRadius: 10, marginTop: 20 }} />
    </ScrollView>
  );

  // 🔄 Main Render
  return loading ? (
    <SettingsShimmer />
  ) : (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Personal Details</Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: avatar || "https://placekitten.com/200/200" }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.changeBtn}>
          <Text style={{ color: "#fff" }}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <Text style={styles.label}>First Name</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

      <Text style={styles.label}>Last Name</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Phone</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  changeBtn: {
    backgroundColor: "#28a745",
    padding: 6,
    borderRadius: 6,
    marginTop: 10,
  },

  label: {
    marginTop: 10,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },

  saveBtn: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});