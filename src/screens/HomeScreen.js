// C:\Users\Hp\Desktop\nono-app\src\screens\HomeScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  FlatList,
} from "react-native";

import HeaderSearch from "../components/home/HeaderSearch";
import QuickActions from "../components/home/QuickActions";
import CategoriesSection from "../components/home/CategoriesSection";
import ProductItem from "../components/home/ProductItem";

import useHomeData from "../hooks/useHomeData";

export default function HomeScreen({ navigation }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const {
    categories,
    locations,
    products,
    loading,
    loadMore,
    refreshing,
    handleRefresh,
  } = useHomeData();

  const handleSearch = (query) => {
    navigation.navigate("SearchResults", {
      query,
      location: selectedLocation,
    });
  };

  const renderProduct = useCallback(
    ({ item }) => <ProductItem item={item} navigation={navigation} />,
    [navigation]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  if (loading && products.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#28a745" barStyle="light-content" />

      {/* Fixed Search Bar */}
      <HeaderSearch
        locations={locations}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onSearch={handleSearch}
      />

      {/* Main Content */}
      <FlatList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderProduct}
        numColumns={2} // 2 columns for product grid
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            {/* Quick Actions */}
            <View style={styles.sectionSpacing}>
              <QuickActions navigation={navigation} />
            </View>

            {/* Categories */}
            <View style={styles.sectionSpacing}>
              <CategoriesSection categories={categories} navigation={navigation} />
            </View>
          </>
        }
      />

      {loading && products.length > 0 && (
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

  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },

  sectionSpacing: {
    marginBottom: 20, // <-- space between sections
  },

  loadingMore: {
    paddingVertical: 10,
  },
});