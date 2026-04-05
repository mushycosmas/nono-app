import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import CategoryCard from '../CategoryCard';

export default function CategoriesSection({ categories, navigation }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Categories</Text>

      <FlatList
        data={categories}
        numColumns={4} // 4 categories per row
        scrollEnabled={false} // handled by parent FlatList
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.row} // spacing between columns
        renderItem={({ item }) => (
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
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});