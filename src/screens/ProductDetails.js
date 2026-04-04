import React from "react";
import { View, Text, Image, FlatList, StyleSheet, Button, Dimensions, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

export default function ProductDetails({ route, navigation }) {
  const { product } = route.params;

  // Helper to format postedTime as "time ago"
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diff = Math.floor((now.getTime() - posted.getTime()) / 1000); // seconds

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const renderImage = ({ item }) => (
    <Image source={{ uri: item.path }} style={styles.productImage} />
  );

  return (
    <ScrollView style={styles.container}>
      {/* Images Carousel */}
      {product.images && product.images.length > 0 ? (
        <FlatList
          data={product.images}
          renderItem={renderImage}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageCarousel}
        />
      ) : (
        <View style={[styles.productImage, styles.noImage]}>
          <Text>No Image</Text>
        </View>
      )}

      <View style={styles.detailsContainer}>
        {/* Product Name */}
        <Text style={styles.productName}>{product.name}</Text>

        {/* Price */}
        <Text style={styles.productPrice}>Tsh {product.price.toLocaleString()}</Text>

        {/* Description */}
        {product.description ? (
          <Text style={styles.productDescription}>{product.description}</Text>
        ) : null}

        {/* Location & Posted Time */}
        <View style={styles.infoRow}>
          <Text style={styles.productInfo}>
            <Icon name="location-sharp" size={14} /> {product.location || "Dar es Salaam"}
          </Text>
          {product.postedTime && (
            <Text style={styles.productInfo}>{getTimeAgo(product.postedTime)}</Text>
          )}
        </View>

        {/* Add to Cart Button */}
        <View style={styles.buttonWrapper}>
          <Button title="Add to Cart" onPress={() => navigation.navigate("Cart")} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  imageCarousel: { maxHeight: 300, marginBottom: 10 },
  productImage: { width: width, height: 300, resizeMode: "cover" },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9ecef",
  },
  detailsContainer: { padding: 15 },
  productName: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  productPrice: { fontSize: 20, fontWeight: "700", color: "#198754", marginBottom: 10 },
  productDescription: { fontSize: 16, color: "#555", marginBottom: 15 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  productInfo: { fontSize: 14, color: "#666" },
  buttonWrapper: { marginTop: 10 },
});