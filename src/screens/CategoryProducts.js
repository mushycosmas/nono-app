import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import ProductItem from '../components/home/ProductItem'; // your product card component
import { fetchProducts } from '../api/api';

export default function CategoryProducts({ route, navigation }) {
  const { categoryId, subcategoryId, subcategoryName } = route.params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const pageSize = 12;

  const loadProducts = async (reset = false) => {
    try {
      if (reset) {
        setRefreshing(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      const response = await fetchProducts(
        reset ? 1 : page,
        pageSize,
        '', // search query empty
        subcategoryId
      );

      const newProducts = response.products || [];

      setProducts((prev) => (reset ? newProducts : [...prev, ...newProducts]));
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('CategoryProducts API error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    setLoading(true);
    loadProducts(true);
  }, [subcategoryId]);

  const renderProduct = useCallback(
    ({ item }) => <ProductItem item={item} navigation={navigation} />,
    [navigation]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#28a745" barStyle="light-content" />

      <Text style={styles.title}>{subcategoryName}</Text>

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
          onEndReached={() => loadProducts()}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={() => loadProducts(true)}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>No products found in this subcategory.</Text>
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { paddingHorizontal: 10, paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 15 },
  loadingMore: { paddingVertical: 10 },
});