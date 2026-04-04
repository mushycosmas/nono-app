import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { USER_ID, BASE_URL } from "../config/user";
import { useNavigation } from "@react-navigation/native";

export default function MyAdsScreen() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch(`${BASE_URL}/seller/products?user_id=${USER_ID}`);
      const data = await res.json();
      const products = data?.products || data || [];
      setAds(products);
    } catch (error) {
      console.log("Ads Error:", error);
      Alert.alert("Error", "Failed to load ads");
    } finally {
      setLoading(false);
    }
  };

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

  const shortTitle = (text) => {
    if (!text) return "";
    return text.length > 25 ? text.substring(0, 25) + "..." : text;
  };

  // ✅ Always return only ONE image for listing screen
  const getImage = (item) => {
    if (!item) return "https://placehold.co/100x100";
    const firstImage = (item.images && item.images[0]) || item.image_url;
    if (firstImage) return firstImage.startsWith("http") ? firstImage : `${BASE_URL}${firstImage}`;
    return "https://placehold.co/100x100";
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: getImage(item) }} style={styles.image} />

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>{shortTitle(item?.title || item?.name)}</Text>
          {item?.is_best && (
            <Text style={styles.bestBadge}>BEST</Text> // Optional “best” badge
          )}
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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Ads</Text>
      {ads.length === 0 ? (
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

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
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
  price: {
    color: "#28a745",
    marginVertical: 4,
  },
  views: {
    fontSize: 12,
    color: "#777",
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
  },
  btn: {
    marginRight: 15,
  },
});