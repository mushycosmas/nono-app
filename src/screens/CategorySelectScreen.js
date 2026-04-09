import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchCategories } from "../api/api";

export default function CategorySelectScreen({ navigation, route }) {
  const { onSelect } = route.params;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data || []);
      setLoading(false);
    };
    loadCategories();
  }, []);

  // Filter categories and subcategories by search
  const getFiltered = () => {
    if (!search) return categories;

    const lowerSearch = search.toLowerCase();

    return categories
      .map((cat) => {
        // Check if category matches
        const categoryMatch = cat.name.toLowerCase().includes(lowerSearch);

        // Filter subcategories
        const matchingSubs = cat.subcategories.filter((s) =>
          s.name.toLowerCase().includes(lowerSearch)
        );

        // Return category only if it matches or has matching subcategories
        if (categoryMatch || matchingSubs.length > 0) {
          return { ...cat, subcategories: matchingSubs.length > 0 ? matchingSubs : cat.subcategories };
        }

        return null;
      })
      .filter(Boolean);
  };

  const filteredCategories = getFiltered();

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Search Category or Subcategory..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#28a745" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
          {!selectedCategory &&
            filteredCategories.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.item}
                onPress={() => setSelectedCategory(c)}
              >
                <Text>{c.name}</Text>
              </TouchableOpacity>
            ))}

          {selectedCategory &&
            selectedCategory.subcategories.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={styles.item}
                onPress={() => {
                  onSelect(selectedCategory, s);
                  navigation.goBack();
                }}
              >
                <Text>{s.name}</Text>
              </TouchableOpacity>
            ))}

          {selectedCategory && (
            <TouchableOpacity
              style={[styles.item, { backgroundColor: "#eee", marginTop: 10 }]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={{ color: "#28a745" }}>← Back to Categories</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  searchInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});