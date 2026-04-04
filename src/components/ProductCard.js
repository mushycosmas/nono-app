import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ width: '48%', margin: 5, backgroundColor: '#fff', borderRadius: 8, padding: 10 }}>

      <Image source={{ uri: product.image }} style={{ width: '100%', height: 120, borderRadius: 8 }} />

      {/* <Image source={{product.image}}  style={{ width:'60%'}}/> */}

      <Text numberOfLines={1} style={{ fontWeight: 'bold', marginTop: 5 }}>{product.name}</Text>
      <Text style={{ color: '#28a745', marginTop: 2 }}>TZS {product.price}</Text>

   

    </TouchableOpacity>
  );
}