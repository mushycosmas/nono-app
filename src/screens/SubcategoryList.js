import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // optional, if you have icons per subcategory

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 50) / 2; // 2 columns, with spacing

export default function SubcategoryList({ route, navigation }) {
  const { categoryName, subcategories, categoryId } = route.params;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('CategoryProducts', {
          categoryId,
          subcategoryId: item.id,
          subcategoryName: item.name,
        })
      }
    >
      {/* Optional icon */}
      {item.icon && (
        <Icon name={item.icon} size={28} color="#28a745" style={styles.icon} />
      )}
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoryName}</Text>
      <FlatList
        data={subcategories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#28a745',
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  listContainer: { paddingHorizontal: 15, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  item: {
    width: ITEM_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  icon: {
    marginBottom: 10,
  },
});