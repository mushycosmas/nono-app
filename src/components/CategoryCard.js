import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CategoryCard({ name, icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {icon ? (
        <Icon name={icon} size={36} color="#28a745" style={styles.icon} />
      ) : (
        <View style={[styles.icon, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>?</Text>
        </View>
      )}
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
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
    marginBottom: 8,
  },
  name: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
});