import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchCategories } from "../api/api";

import { useSell } from "../contexts/SellContext";

export default function CategorySelectScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ✅ MUST BE INSIDE COMPONENT
  const { setCategory, setSubcategory } = useSell();

  useEffect(() => {
    const load = async () => {
      const data = await fetchCategories();
      setCategories(data || []);
      setLoading(false);
    };
    load();
  }, []);

 const handleSelect = (cat, sub) => {
  setCategory(cat);
  setSubcategory(sub);

  navigation.goBack(); // ✅ NOT navigate
};

  return (
    <SafeAreaView style={{ flex: 1, padding: 15 }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView>
          {!selectedCategory &&
            categories.map((c) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedCategory(c)}
                style={{ padding: 15, borderBottomWidth: 1 }}
              >
                <Text>{c.name}</Text>
              </TouchableOpacity>
            ))}

          {selectedCategory &&
            selectedCategory.subcategories?.map((s) => (
              <TouchableOpacity
                key={s.id}
                onPress={() => handleSelect(selectedCategory, s)}
                style={{ padding: 15 }}
              >
                <Text>{s.name}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}