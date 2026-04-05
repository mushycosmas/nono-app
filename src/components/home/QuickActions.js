import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import QuickCard from '../QuickCard';

export default function QuickActions({ navigation }) {
  const data = [
    { title: 'Game Centre' },
    { title: 'How to Sell', onPress: () => navigation.navigate('Sell') },
    { title: 'How to Buy' },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Quick Actions</Text>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <QuickCard title={item.title} onPress={item.onPress} />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 15, paddingHorizontal: 15 },
  title: { fontSize: 18, fontWeight: '700' },
});