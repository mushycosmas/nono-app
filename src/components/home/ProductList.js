import React from "react";
import { FlatList, ActivityIndicator, View } from "react-native";
import ProductItem from "./ProductItem";

export default function ProductList({ products, loadMore, loadingMore }) {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductItem item={item} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: "space-between",
        paddingHorizontal: 15,
        
      }}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}

      // 🔥 FOOTER LOADER
      ListFooterComponent={
        loadingMore ? (
          <View style={{ padding: 20 }}>
            <ActivityIndicator size="small" />
          </View>
        ) : null
      }
    />
  );
}