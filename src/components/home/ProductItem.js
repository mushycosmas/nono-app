import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getImageUrl } from '../../utils/imageHelper';
import { getTimeAgo } from '../../utils/formatTime';

function ProductItem({ item, navigation }) {
  const imageUrl = getImageUrl(item.images?.[0]?.path);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.noImage}>
          <Text>No Image</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>
          Tsh {Number(item.price || 0).toLocaleString()}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.small}>
            <Icon name="location-sharp" size={12} /> {item.location}
          </Text>
          <Text style={styles.small}>{getTimeAgo(item.created_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProductItem);

const styles = StyleSheet.create({
  card: {
    flex: 0.48,             // 2 cards per row
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,       // vertical space between rows
    marginHorizontal: 5,    // horizontal space between columns
    overflow: "hidden",
  },
  image: { height: 150, width: "100%" },
  body: { padding: 8 },
  price: { color: "green", fontWeight: "bold" },
  footer: { flexDirection: "row", justifyContent: "space-between" },
  small: { fontSize: 10 },
});