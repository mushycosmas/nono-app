import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { fetchProducts } from "../api/api";
import ProductItem from "./home/ProductItem";

const { width } = Dimensions.get("window");

export default function SimilarAds({ subcategoryId, navigation }) {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!subcategoryId) return;

    const loadSimilar = async () => {
      setLoading(true);
      try {
        const res = await fetchProducts(1, 12, "", subcategoryId);
        const filtered = res?.products || [];
        setSimilarProducts(filtered);
      } catch (error) {
        console.log("❌ Error loading similar ads:", error);
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadSimilar();
  }, [subcategoryId]);

  // Calculate column width for 2-column grid
  const columnWidth = (width - 15 * 3) / 2; // padding + margin

  const renderItem = ({ item }) => (
    <View style={[styles.itemWrapper, { width: columnWidth }]}>
      <ProductItem item={item} navigation={navigation} />
    </View>
  );

  return (
    <View style={styles.similarContainer}>
      <Text style={styles.similarTitle}>Similar Ads</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#28a745"
          style={{ marginVertical: 20 }}
        />
      ) : similarProducts.length === 0 ? (
        <Text style={styles.noSimilar}>No similar ads found</Text>
      ) : (
        <FlatList
          data={similarProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2} // <-- two columns
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 15, marginBottom: 15 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  similarContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingBottom: 10,
  },
  similarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    padding: 15,
  },
  itemWrapper: {
    marginBottom: 15,
  },
  noSimilar: {
    padding: 15,
    color: "#666",
  },
});