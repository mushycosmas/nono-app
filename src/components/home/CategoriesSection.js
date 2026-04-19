import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import CategoryCard from '../CategoryCard';

export default function CategoriesSection({ categories, navigation }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Categories</Text>

      <FlatList
        data={categories}
        numColumns={4}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}

        // ✅ FIX 1: equal left & right spacing
        contentContainerStyle={styles.container}

        // ✅ FIX 2: spacing between rows
        columnWrapperStyle={styles.row}

        renderItem={({ item }) => (
          <View style={styles.item}>
            <CategoryCard
              name={item.name}
              icon={item.icon}
              onPress={() =>
                navigation.navigate('SubcategoryList', {
                  categoryId: item.id,
                  categoryName: item.name,
                  subcategories: item.subcategories || [],
                })
              }
            />
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  section: {
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,

    // ✅ FIX 3: equal spacing left & right
    paddingHorizontal: 10,

    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },

  container: {
    paddingBottom: 10,
  },

  row: {
    justifyContent: 'space-between', // ✅ even spacing
    marginBottom: 12,
  },

  item: {
    flex: 1,               // ✅ prevents overflow
    alignItems: 'center',  // center each card
  },
});