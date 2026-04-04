import React from "react";
import { View, Text, ScrollView } from "react-native";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function ProductsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Products</Text>
      <ScrollView>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={() => navigation.navigate("ProductDetails", { product })}
          />
        ))}
      </ScrollView>
    </View>
  );
}