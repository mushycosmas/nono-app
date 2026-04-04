import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const BASE_URL = "https://nono.co.tz"; // Your domain

export default function EditProductScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { product } = route.params;

  // Utility to get full image URL
  const getImageUrl = (img: string) => {
    if (!img) return "https://placehold.co/100x100"; // fallback
    if (img.startsWith("http")) return img;
    
    return `${BASE_URL}${img}`;
  
  };

  // Form state
  const [form, setForm] = useState({
    name: product.name || "",
    price: product.price?.toString() || "",
    description: product.product_description || "",
    location: product.location || "",
    status: product.status || "active",
    category_id: product.category_id?.toString() || "1",
    subcategory_id: product.subcategory_id?.toString() || "11",
    
  });

  const [images, setImages] = useState(
    (product.images || []).map((img) => getImageUrl(img))
  );
  const [newImages, setNewImages] = useState([]);

  // Static categories
  const staticCategories = [
    {
      id: "1",
      name: "Electronics",
      subcategories: [
        { id: "11", name: "Laptops" },
        { id: "12", name: "Phones" },
      ],
    },
    {
      id: "2",
      name: "Fashion",
      subcategories: [
        { id: "21", name: "Shirts" },
        { id: "22", name: "Shoes" },
      ],
    },
  ];

  const [filteredSubcategories, setFilteredSubcategories] = useState(
    staticCategories.find((c) => c.id === form.category_id)?.subcategories ||
      []
  );

  useEffect(() => {
    const category = staticCategories.find((c) => c.id === form.category_id);
    if (category) {
      setFilteredSubcategories(category.subcategories);
      if (!category.subcategories.some((s) => s.id === form.subcategory_id)) {
        setForm({ ...form, subcategory_id: category.subcategories[0].id });
      }
    }
  }, [form.category_id]);

  // Wholesale tiers
  const [wholesaleTiers, setWholesaleTiers] = useState(
    product.wholesale_tiers || [{ min_qty: 1, max_qty: 5, whole_seller_price: "" }]
  );

  const addTier = () =>
    setWholesaleTiers((prev) => [
      ...prev,
      { min_qty: 1, max_qty: 5, whole_seller_price: "" },
    ]);

  const updateTier = (index: number, field: string, value: string) => {
    const updated = [...wholesaleTiers];
    updated[index] = {
      ...updated[index],
      [field]: field === "whole_seller_price" ? value : Number(value),
    };
    setWholesaleTiers(updated);
  };

  const removeTier = (index: number) =>
    setWholesaleTiers((prev) => prev.filter((_, i) => i !== index));

  // Remove existing image
  const removeImage = (uri: string) => setImages((prev) => prev.filter((i) => i !== uri));

  // Remove new image
  const removeNewImage = (index: number) =>
    setNewImages((prev) => prev.filter((_, i) => i !== index));

  // Placeholder for adding new images
  const addNewImage = () => {
    Alert.alert("Add new image", "Implement image picker here");
  };

  const handleUpdate = () => {
    if (!form.name || !form.price || !form.location) {
      Alert.alert("Please fill all required fields");
      return;
    }

    const updatedProduct = {
      ...form,
      price: Number(form.price),
      wholesale_tiers: wholesaleTiers,
      images: images.concat(newImages.map((img) => img.uri || img)), // combine old + new
    };

    console.log("Updated product:", updatedProduct);
    // TODO: call API to save product
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>

    

      {/* Existing Images */}
      <Text style={styles.label}>Existing Images</Text>
      <ScrollView horizontal style={{ marginBottom: 10 }}>
        {images.map((img, idx) => (
          <View key={idx} style={styles.imageWrapper}>
            <Image source={{ uri: getImageUrl(img) }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeIcon}
              onPress={() => removeImage(img)}
            >
              <Icon name="close-circle" size={24} color="#dc3545" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* New Images */}
      <Text style={styles.label}>New Images</Text>
      <ScrollView horizontal style={{ marginBottom: 10 }}>
        {newImages.map((img, idx) => (
          <View key={idx} style={styles.imageWrapper}>
            <Image source={{ uri: img.uri || getImageUrl(img) }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeIcon}
              onPress={() => removeNewImage(idx)}
            >
              <Icon name="close-circle" size={24} color="#dc3545" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addImageBtn} onPress={addNewImage}>
          <Icon name="add-circle-outline" size={40} color="#28a745" />
        </TouchableOpacity>
      </ScrollView>

      {/* Form Fields */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={form.price}
        keyboardType="numeric"
        onChangeText={(text) => setForm({ ...form, price: text })}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={form.location}
        onChangeText={(text) => setForm({ ...form, location: text })}
      />

      {/* Category & Subcategory */}
      <Text style={styles.label}>Category</Text>
      {staticCategories.map((c) => (
        <TouchableOpacity
          key={c.id}
          onPress={() => setForm({ ...form, category_id: c.id })}
          style={[styles.option, form.category_id === c.id && styles.optionSelected]}
        >
          <Text>{c.name}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Subcategory</Text>
      {filteredSubcategories.map((s) => (
        <TouchableOpacity
          key={s.id}
          onPress={() => setForm({ ...form, subcategory_id: s.id })}
          style={[styles.option, form.subcategory_id === s.id && styles.optionSelected]}
        >
          <Text>{s.name}</Text>
        </TouchableOpacity>
      ))}

      {/* Wholesale Tiers */}
      <Text style={styles.label}>Wholesale Tiers</Text>
      <FlatList
        data={wholesaleTiers}
        scrollEnabled={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tierRow}>
            <TextInput
              value={item.min_qty.toString()}
              onChangeText={(v) => updateTier(index, "min_qty", v)}
              placeholder="Min"
              keyboardType="numeric"
              style={styles.tierInput}
            />
            <TextInput
              value={item.max_qty.toString()}
              onChangeText={(v) => updateTier(index, "max_qty", v)}
              placeholder="Max"
              keyboardType="numeric"
              style={styles.tierInput}
            />
            <TextInput
              value={item.whole_seller_price}
              onChangeText={(v) => updateTier(index, "whole_seller_price", v)}
              placeholder="Price"
              keyboardType="numeric"
              style={styles.tierInput}
            />
            <TouchableOpacity onPress={() => removeTier(index)}>
              <Icon name="close-circle" size={24} color="#dc3545" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addTierBtn} onPress={addTier}>
        <Text style={{ color: "#28a745" }}>+ Add Tier</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
        <Text style={styles.btnText}>Update Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  label: { marginTop: 10, fontWeight: "600" },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginTop: 5 },
  btn: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  imageWrapper: { marginRight: 10, position: "relative" },
  image: { width: 100, height: 100, borderRadius: 8 },
  removeIcon: { position: "absolute", top: -5, right: -5 },
  addImageBtn: { justifyContent: "center", alignItems: "center", marginTop: 10 },
  option: { padding: 10, backgroundColor: "#fff", borderRadius: 8, marginTop: 5 },
  optionSelected: { backgroundColor: "#ddd" },
  tierRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  tierInput: { borderWidth: 1, flex: 1, marginRight: 4, padding: 4, borderRadius: 4 },
  addTierBtn: { marginTop: 5, marginBottom: 10 },
 
  
});