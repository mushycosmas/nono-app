// src/screens/ProductDetails.js
import React, { useRef, useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchProducts } from "../api/api";
import ProductItem from "../components/home/ProductItem";

const { width } = Dimensions.get("window");
const BASE_URL = "https://nono.co.tz";

export default function ProductDetails({ route, navigation }) {
  const { product } = route.params;

  const flatListRef = useRef();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // ✅ FIX subcategory_id fallback
  const subcategoryId = product?.subcategory_id || product?.subcategory?.id;

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

  // ---------------- LOAD SIMILAR PRODUCTS ----------------
  useEffect(() => {
    const loadSimilar = async () => {
      if (!subcategoryId) {
        console.log("❌ No subcategory_id found");
        setLoadingSimilar(false);
        return;
      }

      setLoadingSimilar(true);

      try {
        const res = await fetchProducts(1, 12, "", subcategoryId);

        const list = res?.products || [];

        // remove current product
        const filtered = list.filter((p) => p.id !== product.id);

        setSimilarProducts(filtered);
      } catch (err) {
        console.log("❌ Similar Ads error:", err);
        setSimilarProducts([]);
      } finally {
        setLoadingSimilar(false);
      }
    };

    loadSimilar();
  }, [subcategoryId]);

  // ---------------- WHATSAPP ----------------
  const openWhatsApp = () => {
    const phone = product?.user?.phone?.replace(/\s|\+/g, "");
    const message = `Hi, I'm interested in your product ${product.name}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
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

  // ---------------- DESCRIPTION ----------------
  const fullDescription = product.description || product.product_description || "";

  const shortText =
    fullDescription.length > 120
      ? fullDescription.substring(0, 120) + "..."
      : fullDescription;

  // ---------------- WHOLESALE TIERS ----------------
  const renderWholesaleTiers = (tiers) => {
    if (!tiers || tiers.length === 0) return null;
    return tiers.map((tier) => (
      <Text key={tier.id} style={styles.wholesalePrice}>
        {tier.min_qty} - {tier.max_qty} pcs: Tsh {Number(tier.whole_seller_price).toLocaleString()}
      </Text>
    ));
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
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setCurrentIndex(index);
              }}
            />

            {currentIndex > 0 && (
              <TouchableOpacity
                style={[styles.arrow, { left: 10 }]}
                onPress={() => scrollTo(currentIndex - 1)}
              >
                <Icon name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>
            )}

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

        {/* REGULAR PRICE */}
        <Text style={styles.price}>
          Tsh {Number(product.price || 0).toLocaleString()}
        </Text>

        {/* WHOLESALE TIERS */}
        {renderWholesaleTiers(product.wholesale_tiers)}

        <Text style={styles.meta}>
          {product.category?.name} • {product.subcategory?.name}
        </Text>

        <View style={styles.row}>
          <Text style={styles.meta}>
            <Icon name="location-sharp" size={14} /> {product.location}
          </Text>
          <Text style={styles.meta}>{getTimeAgo(product.created_at)}</Text>
        </View>

        {/* ---------------- DESCRIPTION WITH READ MORE ---------------- */}
        <Text style={styles.description}>{expanded ? fullDescription : shortText}</Text>

        {fullDescription.length > 120 && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.readMore}>{expanded ? "Show Less" : "Read More"}</Text>
          </TouchableOpacity>
        )}

        {/* ---------------- SELLER ---------------- */}
        <View style={styles.sellerCard}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color="#fff" />
          </View>

          <Text style={styles.sellerName}>{product.user?.name || "Unknown Seller"}</Text>

          <Text style={styles.sellerPhone}>{product.user?.phone || "N/A"}</Text>

          <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
            <Icon name="logo-whatsapp" size={18} color="#fff" />
            <Text style={styles.whatsappText}>Chat via WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ---------------- SIMILAR PRODUCTS ---------------- */}
      <View style={styles.similarContainer}>
        <Text style={styles.similarTitle}>Similar Ads</Text>

        {loadingSimilar ? (
          <ActivityIndicator size="large" color="#28a745" style={{ marginVertical: 20 }} />
        ) : similarProducts.length === 0 ? (
          <Text style={styles.noSimilar}>No similar ads found</Text>
        ) : (
          <FlatList
            data={similarProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.itemWrapper, { width: (width - 45) / 2 }]}>
                <ProductItem item={item} navigation={navigation} />
               
              </View>
            )}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 15,
              paddingHorizontal: 15,
            }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </ScrollView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  image: { width, height: 300 },
  noImage: { justifyContent: "center", alignItems: "center", backgroundColor: "#eee" },

  arrow: { position: "absolute", top: "45%", backgroundColor: "rgba(0,0,0,0.5)", padding: 8, borderRadius: 20 },

  details: { padding: 15 },

  name: { fontSize: 20, fontWeight: "bold" },
  price: { fontSize: 18, color: "#28a745", marginVertical: 5 },
  wholesalePrice: { fontSize: 14, color: "#FF8C00", fontWeight: "bold", marginTop: 2 },

  meta: { fontSize: 12, color: "#666" },

  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },

  description: { marginTop: 10, fontSize: 14, color: "#444" },
  readMore: { color: "#28a745", marginTop: 5, fontWeight: "bold" },

  sellerCard: { marginTop: 20, backgroundColor: "#fff", padding: 15, borderRadius: 12, alignItems: "center" },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#28a745", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  sellerName: { fontWeight: "bold", fontSize: 16 },
  sellerPhone: { color: "#666", marginBottom: 10 },
  whatsappBtn: { flexDirection: "row", backgroundColor: "#25D366", padding: 10, borderRadius: 8, alignItems: "center" },
  whatsappText: { color: "#fff", marginLeft: 8, fontWeight: "bold" },

  similarContainer: { marginTop: 20 },
  similarTitle: { fontSize: 18, fontWeight: "700", padding: 15 },
  noSimilar: { padding: 15, color: "#666" },
  itemWrapper: {},
});