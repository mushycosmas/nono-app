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
import * as ImagePicker from "expo-image-picker";
import { USER_ID, BASE_URL } from "../config/user";
import NetworkWrapper from "../components/common/NetworkWrapper";

export default function SettingsScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("Dodoma");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [loading, setLoading] = useState(true);

  // 🔥 Convert relative path to full URL
  const getFullImage = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BASE_URL.replace("/api", "")}${path}`;
  };

  // ✅ Fetch user
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/get_user/${USER_ID}`);
      const data = await res.json();
      const user = data.user || data;

      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setLocation(user.location || "Dodoma");
      setPhone(user.phone || "");
      setEmail(user.email || "");
      setAvatar(getFullImage(user.avatar_url)); // ✅ FIXED
    } catch (error) {
      console.log("Fetch Error:", error);
      Alert.alert("Error", "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  // 📸 Pick image
  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // 💾 Save
  const handleSave = async () => {
    // ❌ Prevent empty fields
    if (!firstName || !lastName || !phone || !email) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("id", USER_ID);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("location", location);
      formData.append("phone", phone);
      formData.append("email", email);

      // only upload if new image selected
      if (avatar && !avatar.startsWith("http")) {
        const filename = avatar.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";

        formData.append("avatar", {
          uri: avatar,
          name: filename,
          type,
        });
      }

      const res = await fetch(`${BASE_URL}/save-details`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Profile updated");

        // 🔥 REFRESH USER AFTER SAVE
        fetchUser();
      } else {
        Alert.alert("Error", data.message || "Failed to save");
      }
    } catch (error) {
      console.log("Save Error:", error);
      Alert.alert("Error", "Network error");
    }
  };

  // 🔄 Shimmer
  const SettingsShimmer = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <ShimmerPlaceHolder style={styles.titleShimmer} />

      <View style={styles.avatarContainer}>
        <ShimmerPlaceHolder style={styles.avatar} />
        <ShimmerPlaceHolder style={styles.btnShimmer} />
      </View>

      {[...Array(5)].map((_, i) => (
        <ShimmerPlaceHolder key={i} style={styles.inputShimmer} />
      ))}
    </ScrollView>
  );

  if (loading) return <SettingsShimmer />;

  return (
    
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Personal Details</Text>

      {/* 🔥 Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri:
              avatar ||
              `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=28a745&color=fff`,
          }}
          style={styles.avatar}
          onError={() => console.log("❌ IMAGE FAILED:", avatar)}
        />

        <TouchableOpacity style={styles.changeBtn} onPress={pickAvatar}>
          <Text style={styles.changeText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 Form */}
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

      {/* 🔥 Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f6fa",
    flexGrow: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#28a745",
  },

  changeBtn: {
    marginTop: 10,
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  changeText: {
    color: "#fff",
    fontWeight: "bold",
  },

  label: {
    marginTop: 10,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },

  saveBtn: {
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // shimmer
  titleShimmer: {
    height: 20,
    width: 150,
    borderRadius: 5,
    marginBottom: 15,
  },

  btnShimmer: {
    width: 100,
    height: 30,
    borderRadius: 20,
    marginTop: 10,
  },

  inputShimmer: {
    height: 45,
    borderRadius: 10,
    marginBottom: 10,
  },
});