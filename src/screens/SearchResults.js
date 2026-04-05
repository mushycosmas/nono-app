// C:\Users\Hp\Desktop\nono-app\src\screens\SearchResults.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";

import ProductItem from "../components/home/ProductItem";
import { fetchProducts } from "../api/api"; // your API helper

export default function SearchResults({ route, navigation }) {
  const { query, location } = route.params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // ---------------- FETCH PRODUCTS ----------------
  const loadProducts = async (reset = false) => {
    try {
      if (reset) {
        setRefreshing(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      const response = await fetchProducts(
        reset ? 1 : page,   // page
        12,                 // pageSize
        query,              // search term
        location || ""      // subcategory/location
      );

      const newProducts = response.products || [];

      setProducts((prev) =>
        reset ? newProducts : [...prev, ...newProducts]
      );
      setTotal(response.total || 0);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Search API error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    setLoading(true);
    loadProducts(true);
  }, [query, location]);

  // ---------------- RENDER PRODUCT ----------------
  const renderProduct = useCallback(
    ({ item }) => <ProductItem item={item} navigation={navigation} />,
    [navigation]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#28a745" barStyle="light-content" />

      {loading && products.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#28a745" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={keyExtractor}
          renderItem={renderProduct}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (products.length < total) loadProducts();
          }}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={() => loadProducts(true)}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>No products found for "{query}"</Text>
            </View>
          }
        />
      )}

      {loadingMore && (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color="#28a745" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContainer: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20 },
  columnWrapper: { justifyContent: "space-between", marginBottom: 15 },
  loadingMore: { paddingVertical: 10 },
});