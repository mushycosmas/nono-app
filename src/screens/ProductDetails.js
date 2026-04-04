import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const BASE_URL = "https://nono.co.tz";

export default function ProductDetails({ route }) {
  const { product } = route.params;

  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  // ---------------- IMAGE FIX ----------------
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path}`;
  };

  // ---------------- TIME AGO ----------------
  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const posted = new Date(dateString);
    const diff = Math.floor((now - posted) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // ---------------- IMAGE RENDER ----------------
  const renderImage = ({ item }) => (
    <Image source={{ uri: getImageUrl(item.path) }} style={styles.image} />
  );

  const scrollTo = (index) => {
    if (index >= 0 && index < product.images.length) {
      flatListRef.current.scrollToIndex({ index });
      setCurrentIndex(index);
    }
  };

  // ---------------- WHATSAPP ----------------
  const openWhatsApp = () => {
    const phone = product?.user?.phone?.replace(/\s|\+/g, "");
    const message = `Hi, I'm interested in your product ${product.name}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      {/* ---------------- IMAGE SLIDER ---------------- */}
      <View>
        {product.images?.length > 0 ? (
          <>
            <FlatList
              ref={flatListRef}
              data={product.images}
              renderItem={renderImage}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / width
                );
                setCurrentIndex(index);
              }}
            />

            {/* LEFT ARROW */}
            {currentIndex > 0 && (
              <TouchableOpacity
                style={[styles.arrow, { left: 10 }]}
                onPress={() => scrollTo(currentIndex - 1)}
              >
                <Icon name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>
            )}

            {/* RIGHT ARROW */}
            {currentIndex < product.images.length - 1 && (
              <TouchableOpacity
                style={[styles.arrow, { right: 10 }]}
                onPress={() => scrollTo(currentIndex + 1)}
              >
                <Icon name="chevron-forward" size={28} color="#fff" />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Text>No Image</Text>
          </View>
        )}
      </View>

      {/* ---------------- DETAILS ---------------- */}
      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>

        <Text style={styles.price}>
          Tsh {Number(product.price || 0).toLocaleString()}
        </Text>

        {/* Category */}
        <Text style={styles.meta}>
          {product.category?.name} • {product.subcategory?.name}
        </Text>

        {/* Location + Time */}
        <View style={styles.row}>
          <Text style={styles.meta}>
            <Icon name="location-sharp" size={14} /> {product.location}
          </Text>
          <Text style={styles.meta}>
            {getTimeAgo(product.created_at)}
          </Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          {product.description || product.product_description}
        </Text>

        {/* ---------------- WHOLESALE TIERS ---------------- */}
        {product.wholesale_tiers?.length > 0 && (
          <View style={styles.tiers}>
            <Text style={styles.sectionTitle}>Wholesale Prices</Text>

            {product.wholesale_tiers.map((tier) => (
              <View key={tier.id} style={styles.tierRow}>
                <Text>
                  {tier.min_qty} - {tier.max_qty} pcs
                </Text>
                <Text style={styles.tierPrice}>
                  Tsh {Number(tier.whole_seller_price).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ---------------- SELLER CARD ---------------- */}
        <View style={styles.sellerCard}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color="#fff" />
          </View>

          <Text style={styles.sellerName}>
            {product.user?.name || "Unknown Seller"}
          </Text>

          <Text style={styles.sellerPhone}>
            {product.user?.phone || "N/A"}
          </Text>

          <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
            <Icon name="logo-whatsapp" size={18} color="#fff" />
            <Text style={styles.whatsappText}>Chat via WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  image: { width, height: 300 },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },

  arrow: {
    position: "absolute",
    top: "45%",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },

  details: { padding: 15 },

  name: { fontSize: 20, fontWeight: "bold" },
  price: { fontSize: 18, color: "#28a745", marginVertical: 5 },

  meta: { fontSize: 12, color: "#666" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  description: { marginTop: 10, fontSize: 14, color: "#444" },

  tiers: {
    marginTop: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  tierRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  tierPrice: { color: "#28a745", fontWeight: "bold" },

  sellerCard: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  sellerName: { fontWeight: "bold", fontSize: 16 },
  sellerPhone: { color: "#666", marginBottom: 10 },

  whatsappBtn: {
    flexDirection: "row",
    backgroundColor: "#25D366",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  whatsappText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
});