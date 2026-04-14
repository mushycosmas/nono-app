import React, { useRef, useState, useEffect, useCallback } from "react";
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
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { fetchProducts ,incrementAdView} from "../api/api";
import ProductItem from "../components/home/ProductItem";
  

const { width } = Dimensions.get("window");
const BASE_URL = "https://nono.co.tz";

export default function ProductDetails({ route, navigation }) {
  const [product, setProduct] = useState(route.params.product);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const flatListRef = useRef();
  const subcategoryId = product?.subcategory_id || product?.subcategory?.id;

  // ---------------- IMAGE URL ----------------
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
  const loadSimilarProducts = useCallback(async () => {
    if (!subcategoryId) return;
    setLoadingSimilar(true);
    try {
      const res = await fetchProducts(1, 12, "", subcategoryId);
      const list = res?.products || [];
      const filtered = list.filter((p) => p.id !== product.id);
      setSimilarProducts(filtered);
    } catch (err) {
      console.log("❌ Similar Ads error:", err);
      setSimilarProducts([]);
    } finally {
      setLoadingSimilar(false);
    }
  }, [product.id, subcategoryId]);

  // ---------------- LOAD PRODUCT DETAILS ----------------
 useEffect(() => {
  setLoadingDetails(true);

  setTimeout(() => setLoadingDetails(false), 500);

  loadSimilarProducts();

  if (product?.slug) {
    incrementAdView(product.slug);
  }
 }, [product]);

  // ---------------- NAVIGATE TO ANOTHER PRODUCT ----------------
  const handleSelectProduct = (item) => {
    // Navigate by pushing a new ProductDetails screen
    navigation.push("ProductDetails", { product: item });
  };

  // ---------------- WHATSAPP ----------------
  const openWhatsApp = () => {
    const phone = product?.user?.phone?.replace(/\s|\+/g, "");
    const message = `Hi, I'm interested in your product ${product.name}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  // ---------------- IMAGE SLIDER ----------------
  const renderImage = ({ item }) => (
    <Image source={{ uri: getImageUrl(item.path) }} style={styles.image} />
  );

  const scrollTo = (index) => {
    if (index >= 0 && index < product.images?.length) {
      flatListRef.current.scrollToIndex({ index });
      setCurrentIndex(index);
    }
  };

  const fullDescription =
    product.description || product.product_description || "";
  const shortText =
    fullDescription.length > 120
      ? fullDescription.substring(0, 120) + "..."
      : fullDescription;

  return (
    <ScrollView style={styles.container}>
      {/* ---------------- IMAGE SLIDER ---------------- */}
      <View>
        {loadingDetails ? (
          <ShimmerPlaceHolder
            style={{ width, height: 300 }}
            shimmerStyle={{ borderRadius: 0 }}
          />
        ) : product.images?.length > 0 ? (
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
        {loadingDetails ? (
          <>
            <ShimmerPlaceHolder style={{ width: "70%", height: 20, marginBottom: 10 }} />
            <ShimmerPlaceHolder style={{ width: "40%", height: 20, marginBottom: 10 }} />
            <ShimmerPlaceHolder style={{ width: "60%", height: 14, marginBottom: 5 }} />
            <ShimmerPlaceHolder style={{ width: "50%", height: 14, marginBottom: 5 }} />
            <ShimmerPlaceHolder style={{ width: "100%", height: 14, marginBottom: 5 }} />
          </>
        ) : (
          <>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>
              Tsh {Number(product.price || 0).toLocaleString()}
            </Text>
            <Text style={styles.meta}>
              {product.category?.name} • {product.subcategory?.name}
            </Text>
            <View style={styles.row}>
              <Text style={styles.meta}>
                <Icon name="location-sharp" size={14} /> {product.location}
              </Text>
              <Text style={styles.meta}>{getTimeAgo(product.created_at)}</Text>
            </View>
            <Text style={styles.description}>
              {expanded ? fullDescription : shortText}
            </Text>
            {fullDescription.length > 120 && (
              <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text style={styles.readMore}>
                  {expanded ? "Show Less" : "Read More"}
                </Text>
              </TouchableOpacity>
            )}
            {product.wholesale_tiers?.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Wholesale Prices:</Text>
                {product.wholesale_tiers.map((tier) => (
                  <Text key={tier.id}>
                    {tier.min_qty} - {tier.max_qty} pcs: Tsh{" "}
                    {Number(tier.whole_seller_price).toLocaleString()}
                  </Text>
                ))}
              </View>
            )}
          </>
        )}

        {/* ---------------- SELLER ---------------- */}
        {loadingDetails ? (
          <View style={styles.sellerCard}>
            <ShimmerPlaceHolder
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginBottom: 10,
              }}
            />
            <ShimmerPlaceHolder style={{ width: "50%", height: 16, marginBottom: 5 }} />
            <ShimmerPlaceHolder style={{ width: "40%", height: 14, marginBottom: 10 }} />
            <ShimmerPlaceHolder style={{ width: "60%", height: 36, borderRadius: 8 }} />
          </View>
        ) : (
          <View style={styles.sellerCard}>
            <View style={styles.avatar}>
              <Icon name="person" size={40} color="#fff" />
            </View>
            <Text style={styles.sellerName}>
              {product.user?.name || "Unknown Seller"}
            </Text>
            <Text style={styles.sellerPhone}>{product.user?.phone || "N/A"}</Text>
            <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
              <Icon name="logo-whatsapp" size={18} color="#fff" />
              <Text style={styles.whatsappText}>Chat via WhatsApp</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ---------------- SIMILAR PRODUCTS ---------------- */}
      <View style={styles.similarContainer}>
        <Text style={styles.similarTitle}>Similar Ads</Text>

        {loadingSimilar ? (
          <View style={styles.similarShimmerWrapper}>
            {Array.from({ length: 4 }).map((_, index) => (
              <View
                key={index}
                style={[styles.itemWrapper, { width: (width - 45) / 2 }]}
              >
                <ShimmerPlaceHolder
                  style={{ width: "100%", height: 150, borderRadius: 8 }}
                />
                <ShimmerPlaceHolder
                  style={{ width: "80%", height: 20, marginTop: 8, borderRadius: 4 }}
                />
                <ShimmerPlaceHolder
                  style={{ width: "60%", height: 20, marginTop: 4, borderRadius: 4 }}
                />
              </View>
            ))}
          </View>
        ) : similarProducts.length === 0 ? (
          <Text style={styles.noSimilar}>No similar ads found</Text>
        ) : (
          <FlatList
            data={similarProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectProduct(item)}>
                <View style={[styles.itemWrapper, { width: (width - 45) / 2 }]}>
                  <ProductItem item={item} navigation={navigation} />
                </View>
              </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  image: { width, height: 300 },
  noImage: { justifyContent: "center", alignItems: "center", backgroundColor: "#eee" },
  arrow: { position: "absolute", top: "45%", backgroundColor: "rgba(0,0,0,0.5)", padding: 8, borderRadius: 20 },
  details: { padding: 15 },
  name: { fontSize: 20, fontWeight: "bold" },
  price: { fontSize: 18, color: "#28a745", marginVertical: 5 },
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
  itemWrapper: { marginBottom: 15 },
  similarShimmerWrapper: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 15, marginBottom: 20 },
});