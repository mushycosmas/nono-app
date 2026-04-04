import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchBar from '../components/SearchBar';
import QuickCard from '../components/QuickCard';
import CategoryCard from '../components/CategoryCard';
import { fetchCategories, fetchLocations, fetchProducts } from '../api/api';

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.log);
    fetchLocations().then(setLocations).catch(console.log);
    fetchProducts().then(setProducts).catch(console.log);
  }, []);

  const handleSearch = (query) =>
    navigation.navigate('SearchResults', { query, location: selectedLocation });

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const posted = new Date(dateString);
    const diff = Math.floor((now.getTime() - posted.getTime()) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      {item.images?.[0]?.path ? (
        <Image source={{ uri: item.images[0].path }} style={styles.productImage} />
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
          Tsh {item.price.toLocaleString()}
        </Text>
        {item.description && (
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.productFooter}>
          <Text style={styles.productLocation}>
            <Icon name="location-sharp" size={12} /> {item.location || 'Dar es Salaam'}
          </Text>
          {item.postedTime && <Text style={styles.productTime}>{getTimeAgo(item.postedTime)}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#28a745" barStyle="light-content" />

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar
          locations={locations}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          onSearch={handleSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickCardContainer}
          >
            <QuickCard title="Game Centre" />
            <QuickCard title="How to Sell" onPress={() => navigation.navigate('Sell')} />
            <QuickCard title="How to Buy" />
          </ScrollView>
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
                onPress={() => navigation.navigate('CategoryProducts', { categoryId: cat.id })}
              />
            ))}
          </View>
        </View>

        {/* Products in 2 columns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }}
            contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchSection: {
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 10,
    backgroundColor: '#28a745',
  },
  scrollContent: { paddingBottom: 20 },
  section: { marginTop: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 10 },
  quickCardContainer: { gap: 12 },
  categoriesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  productCard: {
    flex: 0.48,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: { width: '100%', height: 150, resizeMode: 'cover' },
  noImage: { width: '100%', height: 150, backgroundColor: '#e9ecef', justifyContent: 'center', alignItems: 'center' },
  productBody: { padding: 8 },
  productName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  productPrice: { fontSize: 13, fontWeight: '700', color: '#198754', marginBottom: 2 },
  productDescription: { fontSize: 12, color: '#555', marginBottom: 2 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productLocation: { fontSize: 10, color: '#666', flexDirection: 'row', alignItems: 'center' },
  productTime: { fontSize: 10, color: '#666' },
});