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
import * as ImagePicker from "expo-image-picker";

const BASE_URL = "https://nono.co.tz"; // backend domain

export default function EditProductScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;

  // --- Helper ---
  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/100x100";
    if (img.startsWith("http")) return img;
    return `${BASE_URL}${img}`;
  };

  // --- Form State ---
  const [form, setForm] = useState({
    name: product.name || "",
    price: product.price?.toString() || "",
    description: product.product_description || "",
    location: product.location || "",
    status: product.status || "active",
    category_id: product.category_id?.toString() || "1",
    subcategory_id: product.subcategory_id?.toString() || "11",
  });

  // --- Images ---
  const [images, setImages] = useState(
    (product.images || []).map((img) => getImageUrl(img))
  );
  const [newImages, setNewImages] = useState([]);

  // --- Categories ---
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
    staticCategories.find((c) => c.id === form.category_id)?.subcategories || []
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

  // --- Wholesale Tiers ---
  const [wholesaleTiers, setWholesaleTiers] = useState(
    product.wholesale_tiers || [{ min_qty: 1, max_qty: 5, whole_seller_price: "" }]
  );

  const addTier = () =>
    setWholesaleTiers((prev) => [
      ...prev,
      { min_qty: 1, max_qty: 5, whole_seller_price: "" },
    ]);

  const updateTier = (index, field, value) => {
    const updated = [...wholesaleTiers];
    updated[index] = {
      ...updated[index],
      [field]: field === "whole_seller_price" ? value : Number(value),
    };
    setWholesaleTiers(updated);
  };

  const removeTier = (index) =>
    setWholesaleTiers((prev) => prev.filter((_, i) => i !== index));

  // --- Image Picker ---
  const addNewImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to gallery");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setNewImages((prev) => [...prev, ...result.assets]);
    }
  };

  const removeImage = (uri) => setImages((prev) => prev.filter((i) => i !== uri));
  const removeNewImage = (index) =>
    setNewImages((prev) => prev.filter((_, i) => i !== index));

  // --- Update Product ---
  const handleUpdate = () => {
    if (!form.name || !form.price || !form.location) {
      Alert.alert("Please fill all required fields");
      return;
    }

    const updatedProduct = {
      ...form,
      price: Number(form.price),
      wholesale_tiers: wholesaleTiers,
      images: [...images, ...newImages.map((img) => img.uri)],
    };

    console.log("Updated product:", updatedProduct);
    // TODO: call your API here
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Edit Product</Text>

        {/* Existing Images */}
        <Text style={styles.label}>Existing Images</Text>
        <ScrollView horizontal>
          {images.map((img, idx) => (
            <View key={idx} style={styles.imageWrapper}>
              <Image source={{ uri: img }} style={styles.image} />
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
        <ScrollView horizontal>
          {newImages.map((img, idx) => (
            <View key={idx} style={styles.imageWrapper}>
              <Image source={{ uri: img.uri }} style={styles.image} />
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

        {/* Status */}
        <Text style={styles.label}>Status</Text>
        <View style={{ flexDirection: "row" }}>
          {["active", "inactive"].map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.option,
                form.status === s && styles.optionSelected,
              ]}
              onPress={() => setForm({ ...form, status: s })}
            >
              <Text>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        {staticCategories.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.option, form.category_id === c.id && styles.optionSelected]}
            onPress={() => setForm({ ...form, category_id: c.id })}
          >
            <Text>{c.name}</Text>
          </TouchableOpacity>
        ))}

        {/* Subcategory */}
        <Text style={styles.label}>Subcategory</Text>
        {filteredSubcategories.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[
              styles.option,
              form.subcategory_id === s.id && styles.optionSelected,
            ]}
            onPress={() => setForm({ ...form, subcategory_id: s.id })}
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
      </ScrollView>

      {/* Fixed Update Button */}
      <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
        <Text style={styles.btnText}>Update Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  label: { marginTop: 10, fontWeight: "600" },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginTop: 5 },
  btn: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  imageWrapper: { marginRight: 10, position: "relative" },
  image: { width: 100, height: 100, borderRadius: 8 },
  removeIcon: { position: "absolute", top: -5, right: -5 },
  addImageBtn: { justifyContent: "center", alignItems: "center", marginLeft: 10 },
  option: { padding: 10, backgroundColor: "#fff", borderRadius: 8, marginTop: 5 },
  optionSelected: { backgroundColor: "#ddd" },
  tierRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  tierInput: { borderWidth: 1, flex: 1, marginRight: 4, padding: 4, borderRadius: 4 },
  addTierBtn: { marginTop: 5, marginBottom: 10 },
});