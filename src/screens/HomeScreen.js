// C:\Users\Hp\Desktop\nono-app\src\screens\HomeScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  FlatList,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import HeaderSearch from "../components/home/HeaderSearch";
import QuickActions from "../components/home/QuickActions";
import CategoriesSection from "../components/home/CategoriesSection";
import ProductItem from "../components/home/ProductItem";
import NetworkWrapper from "../components/common/NetworkWrapper";
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
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar backgroundColor="#28a745" barStyle="light-content" />

      <View style={styles.container}>
        {/* Search Header */}
        <HeaderSearch
          locations={locations}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          onSearch={handleSearch}
        />

        {/* Products */}
        
        <FlatList
          data={products}
          keyExtractor={keyExtractor}
          renderItem={renderProduct}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          ListHeaderComponent={
            <>
              <View style={styles.sectionSpacing}>
                <QuickActions navigation={navigation} />
              </View>

              <View style={styles.sectionSpacing}>
                <CategoriesSection
                  categories={categories}
                  navigation={navigation}
                />
              </View>
            </>
          }
        />

        {/* Loading more */}
        {loading && products.length > 0 && (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color="#28a745" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#28a745" },
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },

  sectionSpacing: {
    marginBottom: 20, 
  },

  columnWrapper: {
    justifyContent: "space-between", 
    marginBottom: 15, 
  },

  loadingMore: {
    paddingVertical: 10,
  },
});