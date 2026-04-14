import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { USER_ID, BASE_URL } from "../config/user";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function MyAdsScreen() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchAds();
  }, []);

  // ---------------- FETCH ADS ----------------
  const fetchAds = async () => {
    try {
      const res = await fetch(`${BASE_URL}/seller/products?user_id=${USER_ID}`);
      const data = await res.json();
      setAds(data?.products || []);
    } catch (error) {
      console.log("Ads Error:", error);
      Alert.alert("Error", "Failed to load ads");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE PRODUCT ----------------
  const handleDelete = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this product?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${BASE_URL}/seller/products`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if (res.ok) {
              setAds((prev) => prev.filter((item) => item.id !== id));
              Alert.alert("Success", "Ad deleted successfully");
            } else {
              Alert.alert("Error", data.message || "Failed to delete product");
            }
          } catch (error) {
            console.log("Delete error:", error);
            Alert.alert("Error", "Network error");
          }
        },
      },
    ]);
  };

  // ---------------- SHORT TITLE ----------------
  const shortTitle = (text) => (text?.length > 25 ? text.substring(0, 25) + "..." : text || "");

  // ---------------- GET IMAGE ----------------
  const getImage = (item) => {
    if (!item) return "https://placehold.co/100x100";

    const img = (Array.isArray(item.images) && item.images[0]) || item.image_url;
    const BASE = BASE_URL.replace("/api", "");

    return img?.startsWith("http") ? img : `${BASE}${img}`;
  };

  // ---------------- RENDER ITEM ----------------
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: getImage(item) }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={{ flex: 1 }}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{shortTitle(item?.title || item?.name)}</Text>
          {item?.is_best && <Text style={styles.bestBadge}>BEST</Text>}
        </View>
        <Text style={styles.price}>TZS {item?.price || item?.selling_price}</Text>
        <Text style={styles.views}>👁 {item?.views || item?.viewed || 0} views</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate("EditProduct", { product: item })}
          >
            <Icon name="create-outline" size={18} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => handleDelete(item?.id)}>
            <Icon name="trash-outline" size={18} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // ---------------- SHIMMER PLACEHOLDER ----------------
  const renderShimmer = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <View key={index} style={styles.card}>
        <ShimmerPlaceHolder style={styles.image} shimmerStyle={{ borderRadius: 8 }} />
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <ShimmerPlaceHolder
            style={{ width: "60%", height: 20, marginBottom: 5, borderRadius: 4 }}
          />
          <ShimmerPlaceHolder
            style={{ width: "40%", height: 16, marginBottom: 5, borderRadius: 4 }}
          />
          <ShimmerPlaceHolder
            style={{ width: "50%", height: 16, marginBottom: 5, borderRadius: 4 }}
          />
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <ShimmerPlaceHolder
              style={{ width: 30, height: 30, marginRight: 15, borderRadius: 4 }}
            />
            <ShimmerPlaceHolder
              style={{ width: 30, height: 30, borderRadius: 4 }}
            />
          </View>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>My Ads</Text> */}
      {loading ? (
        <View>{renderShimmer()}</View>
      ) : ads.length === 0 ? (
        <Text>No ads found</Text>
      ) : (
        <FlatList
          data={ads}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa", padding: 15 },
  // header: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  titleRow: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 15, fontWeight: "bold" },
  bestBadge: {
    backgroundColor: "#ffc107",
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
  },
  price: { color: "#28a745", marginVertical: 4 },
  views: { fontSize: 12, color: "#777" },
  actions: { flexDirection: "row", marginTop: 8 },
  btn: { marginRight: 15 },
});