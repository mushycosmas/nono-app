import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchBar from '../components/SearchBar';
import QuickCard from '../components/QuickCard';
import CategoryCard from '../components/CategoryCard';
import {
  fetchCategories,
  fetchLocations,
  fetchProducts,
} from '../api/api';

const BASE_URL = 'https://nono.co.tz';

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const quickActions = [
    { title: 'Game Centre' },
    { title: 'How to Sell', onPress: () => navigation.navigate('Sell') },
    { title: 'How to Buy' },
  ];

  // ---------------- FETCH DATA ----------------
  const loadData = async () => {
    try {
      setLoading(true);
      const [cats, locs, prods] = await Promise.all([
        fetchCategories(),
        fetchLocations(),
        fetchProducts(),
      ]);
      setCategories(cats || []);
      setLocations(locs || []);
      setProducts(prods || []);
    } catch (err) {
      console.log('API ERROR:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ---------------- HELPERS ----------------
  const handleSearch = (query) =>
    navigation.navigate('SearchResults', { query, location: selectedLocation });

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const posted = new Date(dateString);
    const diff = Math.floor((now - posted) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (!path.startsWith('/')) path = '/' + path;
    return `${BASE_URL}${path}`;
  };

  // ---------------- PRODUCT CARD ----------------
  const renderProduct = ({ item }) => {
    const imageUrl = getImageUrl(item.images?.[0]?.path);

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.productImage} />
        ) : (
          <View style={styles.noImage}>
            <Text>No Image</Text>
          </View>
        )}

        <View style={styles.productBody}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>

          <Text style={styles.productPrice}>
            Tsh {Number(item.price || 0).toLocaleString()}
          </Text>

          {item.product_description && (
            <Text style={styles.productDescription} numberOfLines={2}>
              {item.product_description}
            </Text>
          )}

          <View style={styles.productFooter}>
            <Text style={styles.productLocation}>
              <Icon name="location-sharp" size={12} />{' '}
              {item.location || 'Unknown'}
            </Text>

            {item.created_at && (
              <Text style={styles.productTime}>{getTimeAgo(item.created_at)}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  // ---------------- UI ----------------
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#28a745" barStyle="light-content" />

      {/* Search */}
      <View style={styles.searchSection}>
        <SearchBar
          locations={locations}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          onSearch={handleSearch}
        />
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <FlatList
                horizontal
                data={quickActions}
                keyExtractor={(item) => item.title}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <QuickCard title={item.title} onPress={item.onPress} />
                )}
              />
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.categoriesContainer}>
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    name={cat.name}
                    icon={cat.icon}
                    onPress={() =>
                      navigation.navigate('CategoryProducts', { categoryId: cat.id })
                    }
                  />
                ))}
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginLeft: 15 }]}>Products</Text>
          </>
        }
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: 15,
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  searchSection: {
    paddingHorizontal: 15,
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight + 10
        : 50,
    paddingBottom: 10,
    backgroundColor: '#28a745',
  },

  section: { marginTop: 15, paddingHorizontal: 15 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },

  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  productCard: {
    flex: 0.48,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },

  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },

  noImage: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },

  productBody: { padding: 8 },

  productName: { fontSize: 14, fontWeight: '600' },

  productPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#198754',
  },

  productDescription: { fontSize: 12, color: '#555' },

  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  productLocation: { fontSize: 10, color: '#666' },
  productTime: { fontSize: 10, color: '#666' },
});