import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function QuickCard({ title, icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ alignItems: 'center', marginRight: 15 }}>
      <Image source={icon} style={{ width: 50, height: 50 }} />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}