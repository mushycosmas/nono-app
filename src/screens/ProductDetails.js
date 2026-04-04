import React from "react";
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

  // ---------------- WHATSAPP ----------------
  const openWhatsApp = () => {
    if (!product.user?.phone) return;

    const phone = product.user.phone.replace(/\s|\+/g, "");
    const message = `Hi, I'm interested in your product ${product.name}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url);
  };

  // ---------------- IMAGE RENDER ----------------
  const renderImage = ({ item }) => {
    const uri = getImageUrl(item.path);

    return (
      <Image
        source={{ uri }}
        style={styles.productImage}
        onError={() => console.log("Image failed:", uri)}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* -------- IMAGE CAROUSEL -------- */}
      {product.images?.length > 0 ? (
        <FlatList
          data={product.images}
          renderItem={renderImage}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <View style={[styles.productImage, styles.noImage]}>
          <Text>No Image</Text>
        </View>
      )}

      {/* -------- PRODUCT INFO -------- */}
      <View style={styles.card}>
        <Text style={styles.productName}>{product.name}</Text>

        <Text style={styles.productPrice}>
          Tsh {Number(product.price).toLocaleString()}
        </Text>

        {/* Category */}
        <Text style={styles.meta}>
          📦 {product.category?.name} → {product.subcategory?.name}
        </Text>

        {/* Location & Time */}
        <View style={styles.row}>
          <Text style={styles.meta}>
            <Icon name="location-sharp" size={14} />{" "}
            {product.location}
          </Text>

          <Text style={styles.meta}>
            {getTimeAgo(product.created_at)}
          </Text>
        </View>

        {/* Description */}
        {product.description && (
          <Text style={styles.description}>
            {product.description.replace(/<[^>]+>/g, "")}
          </Text>
        )}
      </View>

      {/* -------- WHOLESALE TIERS -------- */}
      {product.wholesale_tiers?.length > 0 && (
        <View style={styles.card}>
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

      {/* -------- SELLER CARD -------- */}
      <View style={styles.card}>
        <Image
          source={{
            uri:
              product.user?.avatar_url ||
              "https://placehold.co/100x100",
          }}
          style={styles.avatar}
        />

        <Text style={styles.sellerName}>
          {product.user?.name || "Unknown Seller"}
        </Text>

        <Text style={styles.verified}>Verified Seller</Text>

        <View style={styles.row}>
          <Icon name="call" size={16} />
          <Text style={styles.phone}>
            {product.user?.phone || "N/A"}
          </Text>
        </View>

        {/* WhatsApp Button */}
        <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
          <Icon name="logo-whatsapp" size={18} color="#fff" />
          <Text style={styles.whatsappText}>Chat via WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  productImage: {
    width: width,
    height: 300,
    resizeMode: "cover",
  },

  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },

  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },

  productPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#28a745",
    marginBottom: 8,
  },

  meta: {
    fontSize: 13,
    color: "#666",
    marginBottom: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  description: {
    marginTop: 10,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  tierRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },

  tierPrice: {
    fontWeight: "bold",
    color: "#198754",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginBottom: 10,
  },

  sellerName: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  verified: {
    textAlign: "center",
    color: "gray",
    marginBottom: 10,
  },

  phone: {
    marginLeft: 5,
  },

  whatsappBtn: {
    flexDirection: "row",
    backgroundColor: "#25D366",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  whatsappText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
});