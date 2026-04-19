import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CategoryCard({ name, icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.iconBox}>
        {icon ? (
          <Icon name={icon} size={28} color="#28a745" />
        ) : (
          <Text style={styles.placeholder}>?</Text>
        )}
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  placeholder: {
    fontSize: 18,
    color: '#999',
  },

  name: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    color: '#333',
  },
});