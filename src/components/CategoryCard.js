import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function CategoryCard({ name, icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: icon }} style={styles.icon} />
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  name: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
});